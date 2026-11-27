import { errorResponse } from '../utils/response.js';

/**
 * Small in-memory rate limiter (per client IP), enough for a single server instance.
 * Use a shared store (e.g. Redis) if the API is ever run on more than one instance.
 */
export function rateLimit({ windowMs, max, message }) {
    const hits = new Map();
    const timer = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
    }, Math.min(windowMs, 60_000));
    timer.unref();

    return (req, res, next) => {
        const key = req.ip || req.socket?.remoteAddress || 'unknown';
        const now = Date.now();
        let entry = hits.get(key);
        if (!entry || entry.resetAt <= now) {
            entry = { count: 0, resetAt: now + windowMs };
            hits.set(key, entry);
        }
        entry.count += 1;
        if (entry.count > max) {
            res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
            return errorResponse(res, 429, message);
        }
        return next();
    };
}

/** OTP requests: 20 per hour per IP (the per-number 30-second cooldown is in otpService). */
export const otpSendLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: 'Too many OTP requests from this network. Please try again later.',
});

/** OTP verification attempts: 60 per 15 minutes per IP (per-number attempts are capped at 3). */
export const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: 'Too many verification attempts. Please try again later.',
});
