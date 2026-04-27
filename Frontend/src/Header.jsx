import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./Redux/Slice/authActions.jsx";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[#1f2937] bg-[#0d1321]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-['Space_Grotesk'] text-xl text-[#dde2f6] font-semibold">
            Documate
          </p>
          <p className="text-xs text-[#909096]">
            Redux auth shell with guarded routes and silent refresh
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-[#dde2f6]">
              {user?.name ?? "Authenticated User"}
            </p>
            <p className="text-xs text-[#909096]">
              {user?.email ?? "No email available"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-lg border border-[#00dfc1]/40 px-4 py-2 text-sm font-medium text-[#00dfc1] hover:bg-[#00dfc1]/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
