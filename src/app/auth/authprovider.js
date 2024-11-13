import React from "react";
import useAuth from "./auth";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
