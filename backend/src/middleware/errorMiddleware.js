import { errorResponse } from '../utils/response.js';

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
    // Avoid leaking stack traces in production
    const isDevelopment = process.env.NODE_ENV !== 'production';

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
