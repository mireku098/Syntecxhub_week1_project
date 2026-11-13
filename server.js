const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Express API is running!"
    });
});

// User routes
app.use("/api/users", require("./routes/userRoutes"));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});