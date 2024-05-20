const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Middleware to fetch category by ID
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
    res.json(req.category);
  } catch (error) {
    console.error("Error fetching category details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to create a new category
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });

    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to update category details
exports.update = async (req, res) => {
  try {
    let category = req.category;
    category = Object.assign(category, req.body);

    await category.save();
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to remove a category
exports.remove = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.categoryId);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to list all categories
exports.list = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error listing categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
