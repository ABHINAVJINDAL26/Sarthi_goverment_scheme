// Creates the integration-test database ("<DB_NAME>_test", or TEST_DB_NAME) if it is missing and
// applies the schema / migrations to it. Safe to run repeatedly. Usage: npm run test:db:setup
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

process.env.NODE_ENV = 'test';
const { config } = await import('../src/config/env.js');
const { default: pg } = await import('pg');

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = config.db.database;
if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name) || !name.endsWith('_test')) {
    console.error(`Refusing to use "${name}" as the test database: the name must end with "_test".`);
    process.exit(1);
}

const admin = new pg.Client({ ...config.db, database: 'postgres' });
try {
    await admin.connect();
    const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [name]);
    if (rowCount === 0) {
        await admin.query(`CREATE DATABASE "${name}"`);
        console.log(`Created database ${name}`);
    } else {
        console.log(`Database ${name} already exists`);
    }
} catch (err) {
    console.error(`Could not reach PostgreSQL to prepare ${name}: ${err.message}`);
    process.exit(1);
} finally {
    await admin.end().catch(() => {});
}

const result = spawnSync(process.execPath, ['database/migrate.js'], {
    cwd: backendDir,
    env: { ...process.env, NODE_ENV: 'test' },
    stdio: 'inherit',
});
process.exit(result.status ?? 1);
