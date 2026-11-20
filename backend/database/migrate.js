import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    const client = await pool.connect();
    try {
        console.log('--- Starting Database Migration ---');
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        for (const file of files) {
            console.log(`Running migration: ${file}...`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');

            await client.query(sql);
            console.log(`Successfully applied: ${file}`);
        }

        console.log('--- All Migrations Applied Successfully ---');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
