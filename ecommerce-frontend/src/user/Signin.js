import React, { useState } from "react";
import Layout from "../core/Layout";
import { signin } from "../api"; // Import the signin function from the api
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Signin = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { email, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await signin({ email, password });

      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        // Save user token to local storage
        // Redirect user to dashboard or perform other actions
        navigate("/"); // Redirect to the home page
      }
    } catch (err) {
      setValues({ ...values, error: "Something went wrong.", success: false });
    }
  };

  const signInForm = () => (
    <form onSubmit={handleSubmit}>
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
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  return (
    <Layout
      title="Signin"
      description="Signin to Node React E-commerce App"
      className="container col-md-8 offset-md-2"
    >
      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div>
          <div className="alert alert-success">Signin successful!</div>
          {/* Redirect or perform other actions */}
        </div>
      )}
      {signInForm()}
    </Layout>
  );
};

export default Signin;
