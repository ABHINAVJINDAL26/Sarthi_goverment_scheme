/**
 * Standardized API Response Utilities
 * Ensures consistent response format across all endpoints.
 */

export const successResponse = (res, statusCode = 200, message, data = null) => {
    const responsePayload = {
        success: true,
        message
    };

    if (data !== null && data !== undefined) {
        responsePayload.data = data;
    }

    return res.status(statusCode).json(responsePayload);
};

export const errorResponse = (res, statusCode = 500, message, errors = null) => {
    const responsePayload = {
        success: false,
        message
    };

    if (errors !== null && errors !== undefined) {
        responsePayload.errors = errors;
    }

    return res.status(statusCode).json(responsePayload);
};
