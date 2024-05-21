const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");

const { validationResult } = require("express-validator");



// Signup function: Create a new user
exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    // Check if passwords match
    if (password !== passwordConfirmation) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Ensure email is in lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if this is the first user being created
    const isFirstUser = (await User.countDocuments({})) === 0;

    // Create a new user instance from the request body
    const user = new User({
      name,
      email: normalizedEmail,
      password,
      isAdmin: isFirstUser,
    });

    // Save the user to the database
    await user.save();

    // Remove sensitive information from the response
    user.salt = undefined;
    user.hashed_password = undefined;

    // Respond with the created user object
    res.json({ user });
  } catch (err) {
    // Handle errors during signup
    console.error("Error signing up user:", err);
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Signin function: Authenticate user and generate JWT token
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email is in lowercase
    const normalizedEmail = email.toLowerCase();

    // Find user in the database by email
    const user = await User.findOne({ email: normalizedEmail });

    // If user not found, return error
    if (!user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please sign up.",
      });
    }

    // If password does not match, return error
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password do not match." });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // Set token in cookie for future requests
    res.cookie("t", token, { expire: new Date() + 9999 });

    // Omit sensitive fields from user object
    const { _id, name, role } = user;
    // Respond with token and user details
    res.json({ token, user: { _id, email: normalizedEmail, name, role } });
  } catch (error) {
    // Handle errors during signin
    console.error("Error in signin:", error);
    // Return internal server error
    res.status(500).json({ error: "Internal server error" });
  }
};

// Signout function: Clear JWT token from client's cookies
exports.signout = (req, res) => {
  // Clear JWT token from cookies
  res.clearCookie("t");
  // Respond with signout message
  res.json({ message: "Signout successful" });
};

// Middleware to require signin: Check for JWT token in request headers
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// Middleware to check if the user is authenticated
exports.isAuth = (req, res, next) => {
  try {
    // Check if user is authenticated
    const isUserAuthenticated =
      req.profile &&
      req.auth &&
      req.profile._id.toString() === req.auth._id.toString();
    // If not authenticated, deny access
    if (!isUserAuthenticated) {
      return res.status(403).json({ error: "Access denied" });
    }
    // Move to the next middleware if authenticated
    next();
  } catch (error) {
    // Handle errors in authentication middleware
    console.error("Error in isAuth middleware:", error);
    // Return internal server error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  try {
    // Check if user profile exists and is an admin
    if (!req.profile || !req.profile.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    // Move to the next middleware if admin
    next();
  } catch (error) {
    // Handle errors in admin middleware
    console.error("Error in isAdmin middleware:", error);
    // Return internal server error
    res.status(500).json({ error: "Internal Server Error" });
  }
};
