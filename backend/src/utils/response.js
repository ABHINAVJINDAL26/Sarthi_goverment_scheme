/**
 * Standardized API Response Utilities
 * One response shape for the whole API:
 *   success: { success: true,  message, data? }
 *   error:   { success: false, message, errors? }
 * `data` / `errors` are left out when there is nothing to send.
 */

export const successResponse = (res, statusCode = 200, message = 'OK', data = null) => {
    const responsePayload = {
        success: true,
        message
    };

    if (data !== null && data !== undefined) {
        responsePayload.data = data;
    }

    return res.status(statusCode).json(responsePayload);
};

export const errorResponse = (res, statusCode = 500, message = 'Something went wrong.', errors = null) => {
    const responsePayload = {
        success: false,
        message
    };

    if (errors !== null && errors !== undefined) {
        responsePayload.errors = errors;
    }

    return res.status(statusCode).json(responsePayload);
};
