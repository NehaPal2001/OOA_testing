import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  const userInfo = localStorage.getItem("userInfo");

  const isSessionValid = () => {
    if (!authToken || !userInfo) return false;
    return true;
  };

  if (!isSessionValid()) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("refreshToken");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
