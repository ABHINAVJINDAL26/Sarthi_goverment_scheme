import crypto from 'crypto';
import { getRedisClient, isRedisReady } from '../config/redis.js';

const inMemoryStore = new Map();

const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const RESEND_COOLDOWN_SECONDS = 30; // 30 seconds resend cooldown
const MAX_FAILED_ATTEMPTS = 3;

/**
 * Clean up expired in-memory records periodically
 */
const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of inMemoryStore.entries()) {
        if (value.expiresAt <= now) {
            inMemoryStore.delete(key);
        }
    }
}, 60000);
cleanupInterval.unref();

export const generateAndStoreOtp = async (mobileNumber) => {
    const redis = getRedisClient();
    const useRedis = isRedisReady() && redis;

    // Check resend cooldown
    if (useRedis) {
        try {
            const cooldownKey = `otp_cooldown:${mobileNumber}`;
            const cooldown = await redis.get(cooldownKey);
            if (cooldown) {
                const ttl = await redis.ttl(cooldownKey);
                return {
                    success: false,
                    cooldown: true,
                    remainingSeconds: ttl > 0 ? ttl : 1
                };
            }
        } catch (err) {
            // Redis fallback
        }
    } else {
        const existing = inMemoryStore.get(mobileNumber);
        if (existing && existing.lastSentAt) {
            const elapsed = Math.floor((Date.now() - existing.lastSentAt) / 1000);
            if (elapsed < RESEND_COOLDOWN_SECONDS) {
                return {
                    success: false,
                    cooldown: true,
                    remainingSeconds: RESEND_COOLDOWN_SECONDS - elapsed
                };
            }
        }
    }

    // Generate cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const now = Date.now();

    if (useRedis) {
        try {
            const otpKey = `otp:${mobileNumber}`;
            const cooldownKey = `otp_cooldown:${mobileNumber}`;
            await redis.hSet(otpKey, {
                otp,
                attempts: 0
            });
            await redis.expire(otpKey, OTP_EXPIRY_SECONDS);
            await redis.set(cooldownKey, '1', { EX: RESEND_COOLDOWN_SECONDS });
        } catch (err) {
            // Save to memory as fallback
            inMemoryStore.set(mobileNumber, {
                otp,
                attempts: 0,
                lastSentAt: now,
                expiresAt: now + OTP_EXPIRY_SECONDS * 1000
            });
        }
    } else {
        inMemoryStore.set(mobileNumber, {
            otp,
            attempts: 0,
            lastSentAt: now,
            expiresAt: now + OTP_EXPIRY_SECONDS * 1000
        });
    }

    return {
        success: true,
        otp
    };
};

export const verifyOtpCode = async (mobileNumber, inputOtp) => {
    const redis = getRedisClient();
    const useRedis = isRedisReady() && redis;

    if (useRedis) {
        try {
            const otpKey = `otp:${mobileNumber}`;
            const record = await redis.hGetAll(otpKey);

            if (!record || !record.otp) {
                return { valid: false, reason: 'NOT_FOUND' };
            }

            const attempts = parseInt(record.attempts || '0', 10);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                await redis.del(otpKey);
                return { valid: false, reason: 'MAX_ATTEMPTS_EXCEEDED' };
            }

            if (record.otp !== String(inputOtp).trim()) {
                const nextAttempts = attempts + 1;
                if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
                    await redis.del(otpKey);
                    return { valid: false, reason: 'MAX_ATTEMPTS_EXCEEDED' };
                } else {
                    await redis.hSet(otpKey, 'attempts', nextAttempts);
                    return {
                        valid: false,
                        reason: 'INVALID',
                        attemptsLeft: MAX_FAILED_ATTEMPTS - nextAttempts
                    };
                }
            }

            // OTP verified successfully - remove OTP
            await redis.del(otpKey);
            return { valid: true };
        } catch (err) {
            // Fallback to in-memory check
        }
    }

    // In-memory verification
    const record = inMemoryStore.get(mobileNumber);
    if (!record) {
        return { valid: false, reason: 'NOT_FOUND' };
    }

    if (Date.now() > record.expiresAt) {
        inMemoryStore.delete(mobileNumber);
        return { valid: false, reason: 'EXPIRED' };
    }

    if (record.attempts >= MAX_FAILED_ATTEMPTS) {
        inMemoryStore.delete(mobileNumber);
        return { valid: false, reason: 'MAX_ATTEMPTS_EXCEEDED' };
    }

    if (record.otp !== String(inputOtp).trim()) {
        record.attempts += 1;
        if (record.attempts >= MAX_FAILED_ATTEMPTS) {
            inMemoryStore.delete(mobileNumber);
            return { valid: false, reason: 'MAX_ATTEMPTS_EXCEEDED' };
        }
        return {
            valid: false,
            reason: 'INVALID',
            attemptsLeft: MAX_FAILED_ATTEMPTS - record.attempts
        };
    }

    // OTP matched
    inMemoryStore.delete(mobileNumber);
    return { valid: true };
};
