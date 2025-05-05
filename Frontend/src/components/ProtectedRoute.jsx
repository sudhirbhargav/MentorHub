import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  // If not authenticated, redirect to sign-in page with original path preserved
  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // If token exists, render the child route
  return children;
}
