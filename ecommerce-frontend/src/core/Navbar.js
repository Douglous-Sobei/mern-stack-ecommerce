// src/core/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <ul>
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
      </ul>
    </nav>
  );
};

export default Navbar;
