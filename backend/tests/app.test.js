import './helpers/env.js';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';
import pool from '../src/config/db.js';

let server;
let base;

before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await pool.end();
});

const get = async (p) => {
    const res = await fetch(base + p);
    return { status: res.status, body: await res.json() };
};

test('health reports degraded (503) when the database is not reachable', async () => {
    const { status, body } = await get('/api/health');
    assert.equal(status, 503);
    assert.equal(body.success, true);
    assert.equal(body.data.database, false);
    assert.ok(body.data.schemes >= 30);
});

test('GET /api/schemes returns the same verified dataset as the website', async () => {
    const { status, body } = await get('/api/schemes');
    assert.equal(status, 200);
    assert.equal(body.data.count, body.data.schemes.length);
    assert.ok(body.data.schemes.some((s) => s.id === 'pm-kisan'));
});

test('GET /api/schemes filters like the Explore page', async () => {
    const { body } = await get('/api/schemes?state=Punjab&scope=state');
    assert.ok(body.data.count > 0);
    assert.ok(body.data.schemes.every((s) => s.scope === 'state' && s.states.includes('Punjab')));
});

test('GET /api/schemes/:id returns one scheme or 404', async () => {
    assert.equal((await get('/api/schemes/pm-kisan')).body.data.short_name, 'PM-KISAN');
    const missing = await get('/api/schemes/not-a-scheme');
    assert.equal(missing.status, 404);
    assert.equal(missing.body.success, false);
});

test('GET /api/meta/profile-fields lists fields with the number of schemes that use them', async () => {
    const { body } = await get('/api/meta/profile-fields');
    const age = body.data.fields.find((f) => f.field === 'age');
    assert.ok(age.schemes > 10);
    assert.deepEqual(age.columns, ['date_of_birth']);
    assert.ok(body.data.values.occupation.includes('farmer'));
});

test('unknown routes get a JSON 404', async () => {
    const { status, body } = await get('/api/nope');
    assert.equal(status, 404);
    assert.equal(body.success, false);
});
