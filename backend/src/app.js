// Load and validate .env before anything else reads process.env.
import { config } from './config/env.js';

import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import express from 'express';
import pool, { isDatabaseReady } from './config/db.js';
import { isRedisReady } from './config/redis.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { getScheme, listSchemes, loadSchemes, profileFieldGuide } from './services/schemeService.js';
import { errorResponse, successResponse } from './utils/response.js';

export const app = express();

app.disable('x-powered-by');

// CORS: origins from CORS_ORIGIN / ALLOWED_ORIGINS. Requests without an Origin (curl, Postman) are allowed.
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || config.corsOrigins.includes('*') || config.corsOrigins.includes(origin)) {
            return callback(null, true);
        }
        const err = new Error('Blocked by CORS policy');
        err.status = 403;
        return callback(err);
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => successResponse(res, 200, 'Welcome to the Sarthi Backend API'));

// --- Health -----------------------------------------------------------------
app.get('/api/health', async (req, res) => {
    const database = await isDatabaseReady();
    const status = database ? 'ok' : 'degraded';
    return successResponse(res, database ? 200 : 503, status, {
        status,
        database,
        redis: isRedisReady(),
        schemes: loadSchemes().count,
    });
});

app.get('/api/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        return successResponse(res, 200, 'Database connection is healthy', { databaseTime: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err.message);
        return errorResponse(res, 503, 'Database connection error');
    }
});

// --- Auth and profile (login with OTP, 7 profile cards) -----------------------
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// --- Schemes (read-only, same data as the website) ---------------------------
app.get('/api/schemes', (req, res) => {
    const { state, category, benefit, scope } = req.query;
    const schemes = listSchemes({ state, category, benefit, scope });
    const { version, as_of } = loadSchemes();
    // Same shape as public/data/schemes.json, so the website can use either.
    return successResponse(res, 200, 'OK', { version, as_of, count: schemes.length, schemes });
});

app.get('/api/schemes/:id', (req, res) => {
    const scheme = getScheme(req.params.id);
    if (!scheme) return errorResponse(res, 404, `Scheme not found: ${req.params.id}`);
    return successResponse(res, 200, 'OK', scheme);
});

// --- Profile field guide for the wizard ---------------------------------------
app.get('/api/meta/profile-fields', (req, res) => successResponse(res, 200, 'OK', profileFieldGuide()));

app.use(notFound);
app.use(errorHandler);

/** Start the HTTP server. Returns the server so tests can close it. */
export function start(port = config.port) {
    // Express 5 passes a listen error (e.g. port already in use) to this callback.
    const server = app.listen(port, async (err) => {
        if (err) {
            console.error(err.code === 'EADDRINUSE'
                ? `Port ${port} is already in use. Stop the other server (another "npm run dev"?) or set PORT in .env.`
                : `Could not start the server: ${err.message}`);
            process.exit(1);
        }
        const { port: actual } = server.address();
        console.log(`Sarthi API listening on http://localhost:${actual} (${config.nodeEnv})`);
        console.log(`Database: ${(await isDatabaseReady()) ? 'connected' : 'NOT reachable, check DB_* in .env'}`);
        if (config.otpDevEcho) console.log('OTP_DEV_ECHO is on: OTPs are printed here and returned as devOtp (development only).');
    });
    return server;
}

// `npm start` / `npm run dev` run this file directly; tests import it instead.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    start();
}

export default app;
