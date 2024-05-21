import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./user/Signin";
import SignUp from "./user/Signup";
import Home from "./core/Home";
import Navbar from "./core/Navbar";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
