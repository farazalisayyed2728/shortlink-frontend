import { useState, type ReactNode } from "react";

import api from "../api/client";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem("user_email")
  );

  const login = async (email: string, password: string) => {
    const response = await api.post("/api/auth/login/", {
      email,
      password,
    });

    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("user_email", email);

    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string) => {
    await api.post("/api/auth/register/", {
      email,
      password,
    });

    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");

    setUserEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}