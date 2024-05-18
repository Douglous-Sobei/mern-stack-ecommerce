const formidable = require("formidable");
const fs = require("fs").promises;
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    req.product = product;
    next();
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.read = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).select("-photo");
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product for read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be uploaded" });
    }

    // Extract single values from arrays
    const extractedFields = extractFields(fields);

    // Validate required fields
    const missingFieldError = validateFields(extractedFields);
    if (missingFieldError) {
      return res.status(400).json({ error: missingFieldError });
    }

    const product = new Product(extractedFields);

    // Handle photo file if present
    const photoError = await handlePhoto(files.photo, product);
    if (photoError) {
      return res.status(400).json({ error: photoError });
    }

    // Save product to database
    try {
      const result = await product.save();
      res.json(result);
    } catch (saveErr) {
      console.error("PRODUCT CREATE ERROR:", saveErr);
      return res.status(400).json({ error: errorHandler(saveErr) });
    }
  });
};

const extractFields = (fields) => {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, value[0]])
  );
};

const validateFields = ({
  name,
  description,
  price,
  category,
  quantity,
  shipping,
}) => {
  if (!name || !description || !price || !category || !quantity || !shipping) {
    return "All fields are required";
  }
  return null;
};

const handlePhoto = async (photos, product) => {
  if (!photos || !photos[0]) return null;

  const photo = photos[0];
  if (!photo.filepath) return "File path is not defined";
  if (photo.size > 1000000) return "Image should be less than 1mb in size";

  try {
    product.photo.data = await fs.readFile(photo.filepath);
    product.photo.contentType = photo.mimetype;
    return null;
  } catch (readErr) {
    return "Error reading file";
  }
};
