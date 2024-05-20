const Category = require("../models/category");
const { errrHandler } = require("../helpers/dbErrorHandler");

/// Middleware to fetch category by ID
exports.categoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }
    req.category = category;
    next();
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to read category details
exports.read = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category for read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.create = async (req, res) => {
  try {
    // Extract category data from request body
    const { name, description } = req.body;

    // Create a new category instance
    const category = new Category({
      name,
      description,
    });

    // Save the category to the database
    await category.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    // Handle errors
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
