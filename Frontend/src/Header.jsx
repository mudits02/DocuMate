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
    <header className="sticky top-0 z-20 border-b border-[#1f2937] bg-[#0b1120]/90 backdrop-blur-xl">
      <div className="w-full px-6 py-4 md:px-8 xl:px-10 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="font-['Space_Grotesk'] text-xl text-[#dde2f6] font-semibold tracking-tight">
            Documate
          </p>
          <p className="text-xs uppercase tracking-[0.25em] text-[#6f7a91] mt-1">
            Workspace Overview
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex h-11 w-11 overflow-hidden rounded-2xl border border-[#223046] bg-[#111827]">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name ?? "User avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#00dfc1]">
                {user?.name?.[0] ?? "U"}
              </div>
            )}
          </div>

          <div className="min-w-0 text-right">
            <p className="text-sm text-[#dde2f6] truncate">
              {user?.name ?? "Authenticated User"}
            </p>
            <p className="text-xs text-[#909096] truncate">
              {user?.email ?? "No email available"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-xl border border-[#00dfc1]/30 bg-[#0f2d24]/40 px-4 py-2.5 text-sm font-medium text-[#00dfc1] hover:bg-[#0f2d24] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
