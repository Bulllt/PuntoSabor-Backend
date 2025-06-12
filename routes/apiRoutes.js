const express = require("express");
const restaurantRoutes = require("./restaurantRoutes");
const dishRoutes = require("./dishRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

// API health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Punto Sabor API is running",
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION,
  });
});

// Mount routes
router.use("/restaurants", restaurantRoutes);
router.use("/dishes", dishRoutes);
router.use("/users", userRoutes);

module.exports = router;
