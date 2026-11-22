import { isProduction } from '../config/env.js';
import { errorResponse } from '../utils/response.js';

/** 404 for any route that no router handled. */
export const notFound = (req, res) => errorResponse(res, 404, `Route not found: ${req.method} ${req.path}`);

/**
 * Centralized Error Handling Middleware
 */
// eslint-disable-next-line no-unused-vars -- Express needs the 4-argument signature to treat this as an error handler
export const errorHandler = (err, req, res, next) => {
    // Avoid leaking stack traces in production
    const isDevelopment = !isProduction;

    // PostgreSQL specific errors
    if (err.code === '23505') {
        return errorResponse(res, 409, 'A resource with this identifier already exists.');
    }

    if (err.code === '23514' || err.code === '22P02' || err.code === '22007') {
        return errorResponse(res, 400, 'Invalid data provided violates database constraints.');
    }

    if (err.code === '23503') {
        return errorResponse(res, 404, 'Referenced record was not found.');
    }

    // JSON syntax error in body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return errorResponse(res, 400, 'Malformed JSON in request body.');
    }

    console.error('Unhandled Server Error:', err.message);

    return errorResponse(
        res,
        500,
        'Internal server error. Please try again later.',
        isDevelopment ? { details: err.message } : null
    );
};
