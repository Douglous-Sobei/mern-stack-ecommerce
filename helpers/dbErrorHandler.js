// helpers/dbErrorHandler.js

/**
 * Get unique error field name
 */
const uniqueMessage = (error) => {
  let output = "";
  try {
    // Extract the field causing the unique constraint error
    const fieldName = Object.keys(error.keyPattern).join(", ");
    if (fieldName.includes("email") && fieldName.includes("name")) {
      output = "User already exists";
    } else {
      output = `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } already exists`;
    }
  } catch (ex) {
    output = "Unique field already exists";
  }
  return output;
};

/**
 * Get the error message from the error object
 */
exports.errorHandler = (error) => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errorName in error.errors) {
      if (
        error.errors[errorName].kind === "regexp" &&
        error.errors[errorName].path === "email"
      ) {
        message = "Please fill a valid email address";
      } else if (error.errors[errorName].message) {
        message = error.errors[errorName].message;
      }
    }
  }

  return message;
};
