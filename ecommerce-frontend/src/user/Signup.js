import React, { useState } from "react";
import Layout from "../core/Layout";
import { signup } from "../api"; // Import the signup function from the api

const Signup = () => {
  // State to manage form values and submission status
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    error: "",
    success: false,
  });

  const { name, email, password, passwordConfirmation, error, success } =
    values;

  // Handle input change for form fields
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: "" });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate password confirmation
    if (password !== passwordConfirmation) {
      setValues({ ...values, error: "Passwords do not match." });
      return;
    }

    try {
      // Call the signup API function
      const data = await signup({
        name,
        email,
        password,
        passwordConfirmation,
      });

      // Handle API response
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
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
      setValues({ ...values, error: "Something went wrong.", success: false });
    }
  };

  // Render the signup form
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

  // Render the signup component
  return (
    <Layout
      title="Signup"
      description="Signup to Node React E-commerce App"
      className="container col-md-8 offset-md-2"
    >
      {/* Display error message if present */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Display success message and sign-in link if signup is successful */}
      {success && (
        <div>
          <div className="alert alert-success">Signup successful!</div>
          <p>
            Already have an account? <a href="/signin">Sign in</a>
          </p>
        </div>
      )}
      {/* Render the signup form */}
      {signUpForm()}
      {/* Display form values for debugging purposes */}
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </Layout>
  );
};

export default Signup;
