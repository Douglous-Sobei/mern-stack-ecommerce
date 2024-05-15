const Category = require("../models/category");

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
