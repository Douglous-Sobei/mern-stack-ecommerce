import React, { useState } from "react";
import Layout from "../core/Layout";
import { API } from "../config"; // Ensure to import the API config

const Signup = () => {
  // Initial state for form values, error, and success messages
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    error: "",
    success: false,
  });

  // Destructuring values from state for easy access
  const { name, email, password, passwordConfirmation, error, success } =
    values;

  // Function to handle changes in input fields
  const handleChange = (name) => (event) => {
    // Update state with new value and clear any previous error
    setValues({ ...values, [name]: event.target.value, error: "" });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Check if passwords match before submitting the form
    if (password !== passwordConfirmation) {
      setValues({ ...values, error: "Passwords do not match." });
      return;
    }

    try {
      // Make a POST request to the signup endpoint
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, passwordConfirmation }),
      });

      // Parse the JSON response
      const data = await response.json();

      // Check for errors in the response
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        // Clear form and show success message
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          passwordConfirmation: "",
          error: "",
          success: true,
        });
      }
    } catch (err) {
      // Handle any errors that occurred during the fetch
      setValues({ ...values, error: "Something went wrong.", success: false });
    }
  };

  // Function to render the signup form
  const signUpForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Confirm Password</label>
        <input
          onChange={handleChange("passwordConfirmation")}
          type="password"
          className="form-control"
          value={passwordConfirmation}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  return (
    <Layout
      title="Signup"
      description="Signup to Node React E-commerce App"
      className="container col-md-8 offset-md-2"
    >
      {/* Display error message if any */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Display success message if signup was successful */}
      {success && <div className="alert alert-success">Signup successful!</div>}
      {/* Render the signup form */}
      {signUpForm()}
      {/* Display form values for debugging purposes */}
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </Layout>
  );
};

export default Signup;
