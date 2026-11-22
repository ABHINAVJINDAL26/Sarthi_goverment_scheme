import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testsDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Import config/env.js in a fresh Node process with only the given variables.
 * Runs from tests/ so dotenv does not pick up a developer's backend/.env.
 */
function loadConfig(env) {
    return spawnSync(process.execPath, ['--input-type=module', '-e', "await import('../src/config/env.js')"], {
        cwd: testsDir,
        env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, DB_NAME: 'sarthi', DB_USER: 'postgres', ...env },
        encoding: 'utf8',
    });
}

test('the server refuses to start without JWT_SECRET', () => {
    const r = loadConfig({});
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Missing required environment variable JWT_SECRET/);
});

test('a short JWT_SECRET is rejected', () => {
    const r = loadConfig({ JWT_SECRET: 'short' });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /at least 32 characters/);
});

test('a long JWT_SECRET with DB settings loads', () => {
    const r = loadConfig({ JWT_SECRET: 'x'.repeat(40) });
    assert.equal(r.status, 0, r.stderr);
});
