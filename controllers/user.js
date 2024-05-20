const User = require("../models/user");

// Middleware to fetch user by ID
exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.profile = user;
    next();
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to read user profile
exports.readUserProfile = (req, res) => {
  const userProfile = req.profile;
  userProfile.hashed_password = undefined;
  userProfile.salt = undefined;
  res.json(userProfile);
};

// Controller to update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, password, newPassword, newPasswordConfirmation } =
      req.body;
    const userId = req.profile._id;

    // Check if newPassword and newPasswordConfirmation match
    if (newPassword !== newPasswordConfirmation) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    // Construct the update object based on provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (newPassword) updateFields.password = newPassword;

    // If newPassword is provided, authenticate old password first
    if (newPassword && password) {
      const user = await User.findById(userId);
      if (!user.authenticate(password)) {
        return res.status(400).json({ error: "Incorrect old password" });
      }
    }

    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true }
    );

    // Remove sensitive fields from the response
    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(400).json({ error: "User update failed" });
  }
};
