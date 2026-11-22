import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

/** Numbered .sql files in order: 001_..., 002_... */
export function listMigrations(dir = MIGRATIONS_DIR) {
    return fs.readdirSync(dir).filter((f) => /^\d+_.+\.sql$/.test(f)).sort();
}

/**
 * Empty database: apply schema.sql (the latest schema) and record every migration as applied.
 * Existing database: apply only the migrations not recorded in schema_migrations, in order.
 * Safe to run any number of times.
 */
async function runMigrations() {
    const client = await pool.connect();
    try {
        console.log('--- Starting Database Migration ---');
        await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
            filename VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`);

        const files = listMigrations();
        const { rows } = await client.query(`SELECT to_regclass('public.users') IS NOT NULL AS exists`);

        if (!rows[0].exists) {
            console.log('Empty database: applying schema.sql');
            await client.query('BEGIN');
            await client.query(fs.readFileSync(SCHEMA_FILE, 'utf8'));
            for (const file of files) {
                await client.query('INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT DO NOTHING', [file]);
            }
            await client.query('COMMIT');
            console.log(`Schema created; ${files.length} migration(s) marked as applied.`);
        } else {
            const applied = new Set((await client.query('SELECT filename FROM schema_migrations')).rows.map((r) => r.filename));
            const pending = files.filter((f) => !applied.has(f));
            if (pending.length === 0) console.log('Database is up to date.');
            for (const file of pending) {
                console.log(`Running migration: ${file}...`);
                // Each migration file manages its own BEGIN / COMMIT.
                await client.query(fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'));
                await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
                console.log(`Successfully applied: ${file}`);
            }
        }

        console.log('--- All Migrations Applied Successfully ---');
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        console.error('Migration failed:', error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run only when called as a script (`npm run migrate`), not when imported by tests.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    runMigrations();
}
