import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { errorResponse } from '../utils/response.js';

// No default: config/env.js stops the server if JWT_SECRET is missing or too short.
const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = config.jwtExpiresIn;
const JWT_ALGORITHM = 'HS256';

/**
 * Generate a JWT for an authenticated user
 */
export const generateToken = (user) => {
    return jwt.sign(
        {
            userId: String(user.id),
            mobileNumber: user.mobile_number || user.mobileNumber
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN, algorithm: JWT_ALGORITHM }
    );
};

/**
 * Middleware: Verifies Bearer JWT from Authorization header
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 401, 'Authentication required. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // Pin the algorithm so a token signed with another algorithm is rejected.
    jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] }, (err, decoded) => {
        if (err) {
            return errorResponse(res, 401, 'Invalid or expired authentication token.');
        }

        req.user = decoded;
        next();
    });
};

/**
 * Middleware: Ensures the authenticated user only accesses their own profile
 */
export const checkOwnership = (req, res, next) => {
    if (!req.user || !req.user.userId) {
        return errorResponse(res, 401, 'Unauthorized request.');
    }

    const routeUserId = String(req.params.userId);
    const authUserId = String(req.user.userId);

    if (routeUserId !== authUserId) {
        return errorResponse(res, 403, "Forbidden: You are not authorized to access another user's profile.");
    }

    next();
};
