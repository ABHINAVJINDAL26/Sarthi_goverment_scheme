import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { errorResponse } from "./utils/response.js";

dotenv.config();

const app = express();

// Configurable CORS for Frontend Integration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. Postman, Thunder Client, curl) or allowed origins
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the Sarthi Backend API"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health/db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({
            success: true,
            message: "Database connection is healthy",
            databaseTime: result.rows[0].now
        });
    } catch (err) {
        console.error("Database connection error:", err);
        res.status(500).json({
            success: false,
            message: "Database connection error",
            error: err.message
        });
    }
});

// 404 handler for undefined routes
app.use((req, res) => {
    errorResponse(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
});

// Centralized error handling middleware
app.use(errorHandler);

// Only listen when executed directly (not when imported in tests)
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}

export default app;
