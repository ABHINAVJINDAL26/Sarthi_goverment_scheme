// Preloaded by `npm run test:db` (node --import) before any test file or app module.
// Test mode makes config/env.js use the separate "<DB_NAME>_test" database, so integration
// tests never touch your development data. OTP echo lets the tests read the generated OTP.
process.env.NODE_ENV = 'test';
process.env.OTP_DEV_ECHO = 'true';
