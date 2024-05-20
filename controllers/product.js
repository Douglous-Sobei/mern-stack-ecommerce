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

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=des&limit=4
 * by arrival = /products?sortBy=createdAt&order=des$limit4
 * if no params are sent, then all products are returned
 */

// Controller to list products by sell or arrival
exports.listProducts = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "asc";
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find()
      .select("-photo")
      .populate("category")
      .sort({ [sortBy]: order })
      .limit(limit)
      .exec();

    if (!products) {
      return res.status(404).json({ error: "Products not found" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * It will find the products based on the req product category
 * Other products with same category will be returned
 */

// Controller to list related products
exports.listRelated = async (req, res) => {
  try {
    // Extract productId from request parameters
    const productId = req.params.productId;

    // Find the product by productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find related products based on the same category
    const relatedProducts = await Product.find({
      _id: { $ne: product._id }, // Exclude the current product
      category: product.category, // Match the same category as the current product
    })
      .limit(4) // Limit the number of related products to 4
      .select("-photo") // Exclude the photo field
      .populate("category", "_id name"); // Populate the category field

    res.json(relatedProducts);
  } catch (error) {
    console.error("Error listing related products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to list all categories used in products
exports.listCategories = async (req, res) => {
  try {
    // Find all unique categories from the products
    const categories = await Product.distinct("category");

    if (!categories) {
      return res.status(404).json({ error: "No categories found" });
    }

    res.json(categories);
  } catch (error) {
    console.error("Error listing product categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to list products by search criteria
exports.listBySearch = async (req, res) => {
  const order = req.body.order ? req.body.order : "desc";
  const sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  const limit = req.body.limit ? parseInt(req.body.limit) : 100;
  const skip = parseInt(req.body.skip);
  const findArgs = {};

  // Iterate over each filter in the request body
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // For price filter, use greater than and less than or equal to operators
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        // For other filters, directly assign the filter values
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  try {
    // Execute the query with the specified filters, sorting, and pagination
    const products = await Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec();

    if (!products) {
      return res.status(404).json({ error: "Products not found" });
    }

    res.json({
      size: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error listing products by search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get product photo
exports.photo = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).select("photo");

    if (!product || !product.photo || !product.photo.data) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.set("Content-Type", product.photo.contentType);
    return res.send(product.photo.data);
  } catch (error) {
    console.error("Error fetching product photo:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
