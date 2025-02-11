import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
// Load environment variables
dotenv.config();

// Connect to the database
connectDB();
console.log("Mongo URI: ", process.env.MONGO_URI);
console.log("Port: ", process.env.PORT);
console.log("JWT Secret: ", process.env.JWT_SECRET);
console.log("Done 2 ");

app.use(express.json()); // to accept json data
const corsOptions = {
  origin: "https://www.dev.france-thermometres.fr", // Add your domain
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Handle preflight (OPTIONS) requests for all routes
app.options("*", cors(corsOptions));
// Define API routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello Jin");
});
app.get("/api", (req, res) => {
  res.json("Hello Jin");
});
// Error logging middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).send("Something broke!"); // Send a generic error response
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});
