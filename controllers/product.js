const formidable = require("formidable");
const fs = require("fs").promises;
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Middleware to fetch product by ID
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

// Controller to read product details
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

// Controller to create a new product
exports.create = async (req, res) => {
  try {
    const product = await createProduct(req);
    res.json(product);
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    res.status(400).json({ error: errorHandler(error) });
  }
};

// Controller to remove a product
exports.remove = async (req, res) => {
  try {
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to update a product
exports.update = async (req, res) => {
  try {
    const product = await updateProduct(req);
    res.json(product);
  } catch (error) {
    console.error("PRODUCT UPDATE ERROR:", error);
    res.status(400).json({ error: errorHandler(error) });
  }
};

// Helper function to create a product
const createProduct = async (req) => {
  const { fields, files } = await parseFormData(req);
  const extractedFields = extractFields(fields);
  validateFields(extractedFields);
  const product = new Product(extractedFields);
  await handlePhoto(files.photo, product);
  return product.save();
};

// Helper function to update a product
const updateProduct = async (req) => {
  const { fields, files } = await parseFormData(req);
  const extractedFields = extractFields(fields);
  const product = Object.assign(req.product, extractedFields);
  validateFields(extractedFields);
  await handlePhoto(files.photo, product);
  return product.save();
};

// Helper function to parse form data
const parseFormData = async (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject("Image could not be uploaded");
      } else {
        resolve({ fields, files });
      }
    });
  });
};

// Helper function to extract fields from form data
const extractFields = (fields) => {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, value[0]])
  );
};

// Helper function to validate required fields
const validateFields = ({
  name,
  description,
  price,
  category,
  quantity,
  shipping,
}) => {
  if (!name || !description || !price || !category || !quantity || !shipping) {
    throw new Error("All fields are required");
  }
};

// Helper function to handle product photo
const handlePhoto = async (photos, product) => {
  if (!photos || !photos[0]) return;
  const photo = photos[0];
  if (!photo.filepath) throw new Error("File path is not defined");
  if (photo.size > 1000000)
    throw new Error("Image should be less than 1mb in size");
  product.photo.data = await fs.readFile(photo.filepath);
  product.photo.contentType = photo.mimetype;
};
