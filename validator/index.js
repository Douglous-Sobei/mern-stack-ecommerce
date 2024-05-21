// validator/index.js

const { body, validationResult } = require("express-validator");

exports.userSignupValidator = [
  body("name", "Name is required").notEmpty(),
  body("email", "Email must be between 3 to 32 characters")
    .isLength({ min: 3, max: 32 })
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @ symbol"),
  body("password", "Password is required").notEmpty(),
  body("password")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ error: firstError });
    }
    next(); // If no errors, proceed to the next middleware
  },
];
