const express = require("express");
const router = express.Router();

// Importing necessary controllers and middleware
const { create } = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// Route for creating a product
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);

// Route parameter middleware to extract user ID
router.param("userId", userById);

module.exports = router;
