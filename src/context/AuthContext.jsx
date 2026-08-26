import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";

// =====================================================
// CREATE CONTEXT
// =====================================================

const AuthContext = createContext(null);

// =====================================================
// PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // LOAD AUTH DATA
  // ===================================================

  const loadAuth = () => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      // -----------------------------------------------
      // TOKEN
      // -----------------------------------------------

      if (savedToken) {
        setToken(savedToken);
      } else {
        setToken(null);
      }

      // -----------------------------------------------
      // USER
      // -----------------------------------------------

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);

          if (parsedUser && typeof parsedUser === "object") {
            setUser(parsedUser);
          } else {
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          console.error("USER JSON ERROR:", error);

          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("AUTH LOAD ERROR:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL AUTH
  // ===================================================

  useEffect(() => {
    loadAuth();
  }, []);

  // ===================================================
  // LOGIN / OTP VERIFY SUCCESS
  // ===================================================

  const login = ({
    token: newToken,
    user: newUser,
  } = {}) => {
    try {
      // -----------------------------------------------
      // TOKEN REQUIRED
      // -----------------------------------------------

      if (!newToken) {
        console.error("LOGIN ERROR: Token missing");

        toast.error("Authentication token missing");

        return false;
      }

      // -----------------------------------------------
      // USER REQUIRED
      // -----------------------------------------------

      if (!newUser) {
        console.error("LOGIN ERROR: User missing");

        toast.error("User information missing");

        return false;
      }

      // -----------------------------------------------
      // NORMALIZE USER
      // -----------------------------------------------

      const normalizedUser = {
        ...newUser,
        role: String(newUser?.role || "user").toLowerCase(),
      };

      // -----------------------------------------------
      // SAVE TOKEN
      // -----------------------------------------------

      localStorage.setItem("token", newToken);

      // -----------------------------------------------
      // SAVE USER
      // -----------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
      );

      // -----------------------------------------------
      // UPDATE STATE
      // -----------------------------------------------

      setToken(newToken);
      setUser(normalizedUser);

      toast.success("Login successful");

      return true;
    } catch (error) {
      console.error("LOGIN CONTEXT ERROR:", error);

      toast.error("Unable to login");

      return false;
    }
  };

  // ===================================================
  // UPDATE USER
  // ===================================================

  const updateUser = (updatedUser) => {
    if (!updatedUser) return;

    const normalizedUser = {
      ...updatedUser,
      role: String(
        updatedUser?.role || "user"
      ).toLowerCase(),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(normalizedUser)
    );

    setUser(normalizedUser);
  };

  // ===================================================
  // REFRESH USER FROM BACKEND
  // ===================================================

  const refreshUser = async () => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setToken(null);
      setUser(null);
      return null;
    }

    try {
      const response = await api.get("/user/profile");

      console.log(
        "PROFILE RESPONSE:",
        response.data
      );

      const profile =
        response.data?.user ||
        response.data?.data ||
        response.data;

      if (!profile) {
        return null;
      }

      const normalizedUser = {
        ...profile,
        role: String(
          profile?.role || "user"
        ).toLowerCase(),
      };

      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
      );

      setUser(normalizedUser);

      return normalizedUser;
    } catch (error) {
      console.error(
        "PROFILE REFRESH ERROR:",
        error?.response?.data ||
          error?.message
      );

      // -----------------------------------------------
      // TOKEN INVALID / EXPIRED
      // -----------------------------------------------

      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        logout(false);
      }

      return null;
    }
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = (showMessage = true) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);

      if (showMessage) {
        toast.success("Logged out successfully");
      }

      // Tumhare current OTP login route ke according
      navigate("/verify-otp", {
        replace: true,
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  // ===================================================
  // AUTH STATUS
  // ===================================================

  const isAuthenticated =
    !loading && Boolean(token && user);

  // ===================================================
  // ADMIN STATUS
  // ===================================================

  const isAdmin =
    !loading &&
    String(user?.role || "").toLowerCase() ===
      "admin";

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    user,
    token,
    loading,

    isAuthenticated,
    isAdmin,

    login,
    logout,

    updateUser,
    refreshUser,

    setUser,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

export default AuthContext;