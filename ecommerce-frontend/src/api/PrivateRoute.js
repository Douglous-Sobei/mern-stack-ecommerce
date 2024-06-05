import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "./index";

const PrivateRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("user/dashboard");
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  return null; // or you can return a loading indicator or any other component
};

export default PrivateRoute;
