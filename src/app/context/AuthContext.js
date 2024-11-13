import { useState } from "react";
import { account } from "../appwrite/appwrite.config";

export const useAuth = () => {
  const [user, setUser] = useState(null);

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
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return { user, login, logout };
};
