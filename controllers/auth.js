const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Signup function: Create a new user
exports.signup = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();

    user.salt = undefined;
    user.hashed_password = undefined;

    res.json({ user });
  } catch (error) {
    const errorMessage = errorHandler(error);
    res.status(400).json({ error: errorMessage });
  }
};

// Signin function: Authenticate user and generate JWT token
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({
          error: "User with that email does not exist. Please sign up.",
        });
    }

    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password do not match." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    res.json({ token, user: { _id, email, name, role } });
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Signout function: Clear JWT token from client's cookies
exports.signout = (req, res) => {
  res.clearCookie("t");
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
    const isUser =
      req.profile &&
      req.auth &&
      req.profile._id.toString() === req.auth._id.toString();

    if (!isUser) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Error in isAuth middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  try {
    if (!req.profile) {
      return res.status(403).json({ error: "User profile not found" });
    }

    if (req.profile.role !== 1) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
