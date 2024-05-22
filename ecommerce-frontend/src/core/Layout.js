import React from "react";
import Navbar from "./Navbar";

const Layout = ({
  title = "Title",
  description = "Description",
  className,
  children,
}) => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="jumbotron">
          <h2 className="display-4">{title}</h2>
          <p className="lead">{description}</p>
        </div>
        <div className={className}>{children}</div>
      </div>
      <footer className="footer mt-4 bg-dark text-white text-center py-3">
        <div className="container">
          <p className="mb-0">&copy; 2023 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
