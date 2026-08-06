import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables first
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://freemasoncollections.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Connect Database
connectDB();

console.log("Mongo URI:", process.env.MONGO_URI);
console.log("Port:", process.env.PORT);
console.log("JWT Secret:", process.env.JWT_SECRET);
console.log("Done 2");

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Test routes
app.get("/", (req, res) => {
  res.send("Hello Jin ggg");
});

app.get("/api", (req, res) => {
  console.log("Discoo");
  res.json("Hello Jin gg");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
