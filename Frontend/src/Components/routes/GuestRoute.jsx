import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FullPageLoader = () => (
  <div className="min-h-screen bg-[#0d1321] text-[#dde2f6] flex items-center justify-center">
    <p className="font-['Space_Grotesk'] text-lg tracking-wide">
      Checking your session...
    </p>
  </div>
);

const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
