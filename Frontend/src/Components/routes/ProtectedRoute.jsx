import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FullPageLoader = () => (
  <div className="min-h-screen bg-[#0d1321] text-[#dde2f6] flex items-center justify-center">
    <p className="font-['Space_Grotesk'] text-lg tracking-wide">
      Restoring your workspace...
    </p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
