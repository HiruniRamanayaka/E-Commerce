import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
// import rateLimit from "express-rate-limit";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { jwtErrorHandler } from "./middleware/authMiddleware.js";
import { sanitizeRequest } from "./middleware/sanitizeMiddleware.js";

connectDB();

const app = express();

// SECURITY & MIDDLEWARE
// Security: hide Express info
app.disable("x-powered-by");

// Basic security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],     // block inline JS
        objectSrc: ["'none'"],     // block Flash/Java/ActiveX
        upgradeInsecureRequests: [],    // auto-upgrade HTTP→HTTPS
      },
    },
  })
);

// Important: parse JSON bodies
app.use(express.json({ limit: "16kb" }));

// CORS (allow only frontend URLs)
const allowedOrigins = [
  process.env.FRONTEND_URL, // production frontend
  "https://localhost:5173",   // local Vite dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// // General API limiter (all routes)
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per window
//   message: { message: "Too many requests, please try again later." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Stricter limiter for auth-sensitive routes
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 20,
//   message: { message: "Too many login/profile attempts, slow down." },
// });

// // Apply globally
// app.use("/api/", apiLimiter);

// // Apply stricter to sensitive endpoints
// app.use("/api/users/profile", authLimiter);
// app.use("/api/payments", authLimiter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(sanitizeRequest);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// JWT error handler (express-jwt UnauthorizedError)
app.use(jwtErrorHandler);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  // hide stack in production
  const payload = { message: "Server error" };
  if (process.env.NODE_ENV !== "production") {
    payload.error = err.message;
  }
  res.status(500).json(payload);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
