import { Naviagte } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Naviagte to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
