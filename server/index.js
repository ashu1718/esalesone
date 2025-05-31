const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api", require("./routes/health"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    detail: err.detail,
  });

  // Send appropriate error response
  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? {
            name: err.name,
            code: err.code,
            detail: err.detail,
          }
        : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Database host:", process.env.DB_HOST);
  console.log("CORS enabled for:", process.env.CLIENT_URL || "*");
});
