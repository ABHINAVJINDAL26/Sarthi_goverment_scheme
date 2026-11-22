// Load and validate .env before anything else reads process.env.
import { config } from './config/env.js';

import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import express from 'express';
import { isDatabaseReady } from './config/db.js';
import { isRedisReady } from './config/redis.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { getScheme, listSchemes, loadSchemes, profileFieldGuide } from './services/schemeService.js';
import { errorResponse, successResponse } from './utils/response.js';

export const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

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

// --- Schemes (read-only, same data as the website) ---------------------------
app.get('/api/schemes', (req, res) => {
    const { state, category, benefit, scope } = req.query;
    const schemes = listSchemes({ state, category, benefit, scope });
    return successResponse(res, 200, 'OK', { as_of: loadSchemes().as_of, count: schemes.length, schemes });
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
    const server = app.listen(port, async () => {
        const { port: actual } = server.address();
        console.log(`Sarthi API listening on http://localhost:${actual} (${config.nodeEnv})`);
        console.log(`Database: ${(await isDatabaseReady()) ? 'connected' : 'NOT reachable, check DB_* in .env'}`);
    });
    return server;
}

// `npm start` / `npm run dev` run this file directly; tests import it instead.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    start();
}
