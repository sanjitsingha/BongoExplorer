import React from "react";
import { useEffect } from "react";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
// authService.js
import { useState } from "react";
import { account } from "../appwrite/appwrite.config.js";

const auth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await account.createEmailPasswordSession(
        email,
        password
      );
      const userData = await account.get();
      setUser(userData);
      return { userData, response };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name);
      console.log("Account Created");
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await account.deleteSession("current");
      setUser(null);
      console.log("logged out");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const sendResetEmail = async (email) => {
    try {
      // Replace with your password reset URL
      const resetUrl = "http://localhost:3000/auth/reset_password";
      await account.createRecovery(email, resetUrl);
      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const resetPassword = async (userId, secret, newPassword) => {
    try {
      await account.updateRecovery(userId, secret, newPassword, newPassword);
      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error("Error getting current user:", error);
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return {
    registerUser,
    user,
    login,
    logout,
    isLoading,
    sendResetEmail,
    resetPassword,
  };
};

export default auth;
