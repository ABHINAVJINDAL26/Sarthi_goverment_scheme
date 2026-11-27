import dotenv from 'dotenv';

dotenv.config({ quiet: true });

/**
 * Central place for environment settings. Import this module first (src/app.js does)
 * so every other module sees the values from .env.
 *
 * Required settings fail fast: the server refuses to start without them instead of
 * silently falling back to a value that is published in the repository.
 */

const MIN_SECRET_LENGTH = 32;

function required(name) {
    const value = process.env[name];
    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable ${name}. Copy backend/.env.example to backend/.env and fill it in.`);
    }
    return value.trim();
}

function loadJwtSecret() {
    const secret = required('JWT_SECRET');
    if (secret.length < MIN_SECRET_LENGTH) {
        throw new Error(`JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters long.`);
    }
    return secret;
}

const nodeEnv = process.env.NODE_ENV || 'development';
const isTest = nodeEnv === 'test';

/** Allowed browser origins: CORS_ORIGIN or ALLOWED_ORIGINS, comma-separated ("*" allows any). */
function loadCorsOrigins() {
    const raw = process.env.CORS_ORIGIN || process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173';
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

/**
 * Tests never touch the development database: in test mode the database is TEST_DB_NAME,
 * or "<DB_NAME>_test" when that is not set. `npm run test:db:setup` creates it.
 */
function loadDatabaseName() {
    const name = required('DB_NAME');
    if (!isTest) return name;
    return process.env.TEST_DB_NAME?.trim() || (name.endsWith('_test') ? name : `${name}_test`);
}

/**
 * Echo the OTP in the API response (and print it in the terminal) so the app can be used
 * without an SMS provider. Opt-in only, and refused in production.
 */
function loadOtpDevEcho() {
    const on = process.env.OTP_DEV_ECHO === 'true';
    if (on && nodeEnv === 'production') {
        throw new Error('OTP_DEV_ECHO must not be enabled when NODE_ENV=production.');
    }
    return on;
}

export const config = Object.freeze({
    nodeEnv,
    port: Number(process.env.PORT) || 5000,
    corsOrigins: loadCorsOrigins(),
    jwtSecret: loadJwtSecret(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    otpDevEcho: loadOtpDevEcho(),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: loadDatabaseName(),
        user: required('DB_USER'),
        password: process.env.DB_PASSWORD || '',
    },
});

export const isProduction = config.nodeEnv === 'production';
