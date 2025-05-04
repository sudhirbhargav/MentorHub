import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser as apiLogout,
  setAuthToken,
} from "../services/api"; // Assuming api.js is in ../services

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("authToken")); // Initialize token from localStorage
  const [isLoading, setIsLoading] = useState(true); // Start loading until initial check is done
  const [error, setError] = useState(null); // Store auth errors

  // Function to load user data if a token exists
  const loadUser = useCallback(async () => {
    if (!token) {
      console.log("AuthContext: No token, skipping user load.");
      setIsLoading(false);
      setUser(null); // Ensure user is null if no token
      return;
    }
    console.log("AuthContext: Token found, attempting to load user...");
    // Ensure axios has the token from localStorage if page was reloaded
    setAuthToken(token);
    try {
      const response = await fetchCurrentUser();
      if (response.success) {
        console.log("AuthContext: User loaded successfully:", response.data);
        setUser(response.data);
        setError(null);
      } else {
        console.warn(
          "AuthContext: Failed to load user, clearing state.",
          response
        );
        setUser(null);
        setToken(null); // Clear invalid token state
        apiLogout(); // Clear from localStorage/axios headers
        setError(response.error || "Failed to fetch user data.");
      }
    } catch (err) {
      console.error("AuthContext: Error loading user:", err);
      setUser(null);
      setToken(null);
      apiLogout();
      setError(err.message || "An error occurred fetching user data.");
    } finally {
      setIsLoading(false);
    }
  }, [token]); // Dependency on token

  // Effect to load user on initial mount or when token changes
  useEffect(() => {
    loadUser();
  }, [loadUser]); // Run loadUser when token changes

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password);
      if (response.success) {
        setUser(response.data);
        setToken(response.token); // Token is also set in localStorage by api.js
        setError(null);
        console.log("AuthContext: Login successful.");
        return true; // Indicate success
      } else {
        setError(response.error || "Login failed.");
        console.warn("AuthContext: Login failed.", response);
        return false;
      }
    } catch (err) {
      console.error("AuthContext: Login error:", err);
      setError(
        err.error || err.message || "An unexpected error occurred during login."
      );
      setUser(null);
      setToken(null);
      apiLogout();
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(name, email, password);
      if (response.success) {
        setUser(response.data);
        setToken(response.token); // Token is also set in localStorage by api.js
        setError(null);
        console.log("AuthContext: Registration successful.");
        return true; // Indicate success
      } else {
        setError(response.error || "Registration failed.");
        console.warn("AuthContext: Registration failed.", response);
        return false;
      }
    } catch (err) {
      console.error("AuthContext: Registration error:", err);
      setError(
        err.error ||
          err.message ||
          "An unexpected error occurred during registration."
      );
      setUser(null);
      setToken(null);
      apiLogout();
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log("AuthContext: Logging out.");
    apiLogout(); // Clear token from localStorage and axios headers
    setUser(null);
    setToken(null);
    setError(null);
    // Redirect happens in the component calling logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
