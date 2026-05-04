import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as api from "../api";

const AuthContext = createContext(null);
const STORAGE_KEY = "ethara_token";

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(() =>
    parseJwt(localStorage.getItem(STORAGE_KEY)),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
      setUser(parseJwt(token));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      setToken(response.token);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      return await api.register(username, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
  };

  const value = useMemo(
    () => ({ token, user, login, logout, register, loading }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
