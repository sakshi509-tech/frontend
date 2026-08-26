import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

function AdminRoute() {
  const location = useLocation();

  // =====================================================
  // GET AUTH DATA
  // =====================================================

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!token) {
    return (
      <Navigate
        to="/verify-otp"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =====================================================
  // PARSE USER
  // =====================================================

  let user = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("USER PARSE ERROR:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return (
        <Navigate
          to="/verify-otp"
          replace
          state={{
            from: location.pathname,
          }}
        />
      );
    }
  }

  // =====================================================
  // USER NOT FOUND
  // =====================================================

  if (!user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/verify-otp"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  const role = String(user?.role || "").toLowerCase();

  if (role !== "admin") {
    toast.error("You are not authorized to access this page");

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // =====================================================
  // ADMIN ALLOWED
  // =====================================================

  return <Outlet />;
}

export default AdminRoute;