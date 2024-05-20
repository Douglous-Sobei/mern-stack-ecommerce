const express = require("express");
const router = express.Router();

// Importing necessary controllers and middleware
const {
  create,
  productById,
  read,
  remove,
  update,
  listProducts,
  listRelated,
  listCategories,
} = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// Route for creating a product
router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.get("/products", listProducts);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);

// Route parameter middleware to extract user ID
router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
