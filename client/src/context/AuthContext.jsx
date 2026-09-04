import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("connectcampus_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("connectcampus_token") || null;
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("connectcampus_token");
    localStorage.removeItem("connectcampus_user");
  };

  // Sync token and verify profile on load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem("connectcampus_token");
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem("connectcampus_user", JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn("[Auth] Token expired or invalid, logging out:", err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("connectcampus_token", res.token);
      localStorage.setItem("connectcampus_user", JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || "Login failed");
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("connectcampus_token", res.token);
      localStorage.setItem("connectcampus_user", JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || "Registration failed");
  };

  const updateProfile = async (profileData) => {
    const res = await authAPI.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem("connectcampus_user", JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || "Failed to update profile");
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem("connectcampus_user", JSON.stringify(res.user));
      }
    } catch {
      // Ignored
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
