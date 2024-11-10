// authService.js
import { account } from "../appwrite/appwrite.config.js";

// Register a new user
export const registerUser = async (email, password, name) => {
  try {
    const user = await account.create("unique()", email, password, name);
    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Check if user is logged in
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("User session error:", error);
    return null;
  }
};
