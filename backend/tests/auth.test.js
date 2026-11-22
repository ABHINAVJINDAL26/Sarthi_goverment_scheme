import './helpers/env.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { authenticateToken, checkOwnership, generateToken } from '../src/middleware/authMiddleware.js';

/** Minimal Express-like response that records what the middleware sent. */
function fakeRes() {
    return {
        statusCode: 200,
        body: null,
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; },
    };
}

function runAuth(header) {
    const req = { headers: header ? { authorization: header } : {} };
    const res = fakeRes();
    let nextCalled = false;
    authenticateToken(req, res, () => { nextCalled = true; });
    return { req, res, nextCalled };
}

test('a token from generateToken is accepted and sets req.user', () => {
    const token = generateToken({ id: 42, mobile_number: '9876543210' });
    const { req, nextCalled } = runAuth(`Bearer ${token}`);
    assert.ok(nextCalled);
    assert.equal(req.user.userId, '42');
});

test('missing or malformed Authorization header is rejected with 401', () => {
    assert.equal(runAuth(null).res.statusCode, 401);
    assert.equal(runAuth('Token abc').res.statusCode, 401);
});

test('a token signed with another secret is rejected', () => {
    const forged = jwt.sign({ userId: '42' }, 'some-other-secret-that-is-also-long-0123456789');
    const { res, nextCalled } = runAuth(`Bearer ${forged}`);
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
});

test('an unsigned (alg: none) token is rejected', () => {
    const unsigned = jwt.sign({ userId: '42' }, null, { algorithm: 'none' });
    assert.equal(runAuth(`Bearer ${unsigned}`).res.statusCode, 401);
});

test('checkOwnership blocks access to another user', () => {
    const res = fakeRes();
    let nextCalled = false;
    checkOwnership({ user: { userId: '1' }, params: { userId: '2' } }, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 403);

    let ok = false;
    checkOwnership({ user: { userId: '2' }, params: { userId: '2' } }, fakeRes(), () => { ok = true; });
    assert.ok(ok);
});
