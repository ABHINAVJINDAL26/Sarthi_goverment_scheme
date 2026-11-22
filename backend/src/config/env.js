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

export const config = Object.freeze({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtSecret: loadJwtSecret(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: required('DB_NAME'),
        user: required('DB_USER'),
        password: process.env.DB_PASSWORD || '',
    },
});

export const isProduction = config.nodeEnv === 'production';
