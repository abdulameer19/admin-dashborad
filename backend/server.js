import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors';

const app = express();

// Load environment variables
dotenv.config();



// Connect to the database
connectDB();
console.log("Mongo URI: ", process.env.MONGO_URI);
console.log("Port: ", process.env.PORT);
console.log("JWT Secret: ", process.env.JWT_SECRET);

app.use(express.json()); // to accept json data
const corsOptions = {
  origin: ['http://localhost:3000', 'http://dev.france-thermometres.fr'], // Add your domain
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Define API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.get('/',(req,res)=>{
res.send("helloooo")
})
// Error logging middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).send('Something broke!'); // Send a generic error response
});

// Handle preflight (OPTIONS) requests for all routes
app.options('*', cors(corsOptions)); // Preflight requests for all routes

// Start the server
const PORT = process.env.PORT || 32001;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
