// src/AppRoutes.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./user/Signin";
import SignUp from "./user/Signup";
import Home from "./core/Home";
import PrivateRoute from "./api/PrivateRoute";
import Dashboard from "./user/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="user/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
