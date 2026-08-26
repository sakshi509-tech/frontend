import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!token || !user) {
    return (
      <Navigate
        to="/send-otp"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =====================================================
  // USER LOGGED IN
  // =====================================================

  return children || <Outlet />;
}

export default ProtectedRoute;