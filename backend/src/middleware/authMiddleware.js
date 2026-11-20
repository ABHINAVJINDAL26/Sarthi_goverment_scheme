import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sarthi_secure_jwt_secret_key_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

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
        { expiresIn: JWT_EXPIRES_IN }
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

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
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
