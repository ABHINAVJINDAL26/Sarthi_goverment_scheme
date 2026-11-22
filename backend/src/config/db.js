import pg from 'pg';
import { config } from './env.js';

const pool = new pg.Pool(config.db);

pool.on('error', (err) => {
    // An idle client lost its connection; the pool replaces it on the next query.
    console.error('PostgreSQL pool error:', err.message);
});

/** True when the database answers a trivial query. Used by the health check. */
export async function isDatabaseReady() {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch {
        return false;
    }
}

export default pool;
