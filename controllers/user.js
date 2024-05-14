const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressjwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Signup function
exports.signup = async (req, res) => {
  try {
    // Create a new user instance with request body data
    const newUser = new User(req.body);
    // Save the new user to the database
    const user = await newUser.save();
    // Remove sensitive information from the user object
    user.salt = undefined;
    user.hashed_password = undefined;

    // Respond with the user object
    res.json({ user });
  } catch (error) {
    // If an error occurs during signup, handle it
    // Use errorHandler to format the error message
    const errorMessage = errorHandler(error);
    // Send the formatted error message in the response
    res.status(400).json({ error: errorMessage });
  }
};

// Signin function
exports.signin = async (req, res) => {
  try {
    // Destructure email and password from request body
    const { email: userEmail, password } = req.body;
    // Find user by email in the database
    const user = await User.findOne({ email: userEmail });

    // If user does not exist, return an error
    if (!user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please sign up.",
      });
    }

    // If password does not match, return an error
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password do not match." });
    }

    // Generate JWT token with user id
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Set the token as a cookie with an expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });

    // Respond with the token and user information
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  } catch (error) {
    // If an error occurs during signin, log it
    console.error("Error in signin:", error);
    // Send a generic internal server error message
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Signout function
exports.signout = (req, res) => {
  // Clear the JWT token from the client's cookies
  res.clearCookie("t");
  // Respond with a success message
  res.json({ message: "Signout successful" });
};
