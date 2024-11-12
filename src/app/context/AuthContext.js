import { createContext, useState, useEffect } from "react";
import { account } from "../appwrite/appwrite.config";
import { useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
        setLoading(false);
        setIsUserLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
        setIsUserLoggedIn(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const session = await account.createEmailSession(email, password);
      setUser(session);
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
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isUserLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
