const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

// Initialize express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database Connected"));

// Middleware
app.use(morgan("dev")); // Logger middleware
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(cookieParser()); // Parse cookies attached to the client request
app.use(cors());

// Routes middleware
app.use("/api", authRoutes); // Authentication routes
app.use("/api", userRoutes); // User routes
app.use("/api", categoryRoutes); // Category routes
app.use("/api", productRoutes); // Product routes

// Set up server port
const port = process.env.PORT || 8000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
