/**
 * One response shape for the whole API, so the frontend can always read
 * `success`, `message`, and either `data` or `error`.
 */

export const successResponse = (res, statusCode = 200, message = 'OK', data = null) => {
    return res.status(statusCode).json({ success: true, message, data });
};

export const errorResponse = (res, statusCode = 500, message = 'Something went wrong.', error = null) => {
    const body = { success: false, message };
    if (error) body.error = error;
    return res.status(statusCode).json(body);
};
