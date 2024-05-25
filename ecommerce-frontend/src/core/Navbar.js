import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signout } from "../api";

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleSignout = () => {
    signout(() => {
      navigate("/");
    });
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse show" id="navbarNav">
          <ul className="navbar-nav flex-md-row">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signin">
                Signin
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                Signup
              </Link>
            </li>
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: "pointer", color: "#ffffff" }}
                onClick={handleSignout} // Removed extra arrow function
              >
                Signout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
