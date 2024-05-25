// api/index.js
import { API } from "../config";

export const signup = async (user) => {
  try {
    const response = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return response.json();
  } catch (error) {
    return { error: "Something went wrong." };
  }
};

export const signin = async (user) => {
  try {
    const response = await fetch(`${API}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return response.json();
  } catch (error) {
    return { error: "Something went wrong." };
  }
};

export const authenticate = async (data,next) => {
  if(typeof window !== "undefined"){
    localStorage.setItem("jwt",JSON.stringify(data));
    next();
  }
} 