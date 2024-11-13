import React from "react";
import { useEffect } from "react";
// authService.js
import { useState } from "react";
import { account } from "../appwrite/appwrite.config.js";

const auth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await account.createEmailPasswordSession(
        email,
        password
      );
      setUser(response);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      console.log("logged out");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting current user:", error);
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return { user, login, logout, isLoading };
};

export default auth;
