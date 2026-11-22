// Test settings. Imported first by every test file, before any app module reads process.env.
// DB_PORT 1 has nothing listening, so database calls fail fast and tests need no PostgreSQL.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ??= 'test-secret-that-is-long-enough-for-hs256-0123456789';
process.env.DB_HOST ??= '127.0.0.1';
process.env.DB_PORT ??= '1';
process.env.DB_NAME ??= 'sarthi_test';
process.env.DB_USER ??= 'postgres';
delete process.env.USE_REDIS;
delete process.env.REDIS_HOST;
