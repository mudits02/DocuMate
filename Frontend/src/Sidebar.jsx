import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "./Redux/Slice/authActions.jsx";

const icons = {
  brand: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 6h16v12H4z" />
      <path d="M8 10l3 2-3 2" />
      <path d="M13 14h3" />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h7v7H4z" />
      <path d="M13 4h7v5h-7z" />
      <path d="M13 11h7v9h-7z" />
      <path d="M4 13h7v7H4z" />
    </svg>
  ),
  analysis: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19V5h16v14H4z" />
      <path d="M8 15v-4" />
      <path d="M12 15V9" />
      <path d="M16 15v-2" />
    </svg>
  ),
  docs: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4h10l3 3v13H7z" />
      <path d="M17 4v4h4" />
      <path d="M10 12h7" />
      <path d="M10 16h5" />
    </svg>
  ),
  reviews: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h16v11H8l-4 3z" />
      <path d="M8 10h8" />
      <path d="M8 13h5" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V22a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06A2 2 0 1 1 4.28 16.9l.06-.06A1.7 1.7 0 0 0 4.68 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06A2 2 0 1 1 7.07 4.24l.06.06A1.7 1.7 0 0 0 9 4a1.7 1.7 0 0 0 1-1.55V2a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 3.64a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9.2 9a3 3 0 1 1 5.35 1.86c-.9.78-1.55 1.28-1.55 2.64" />
      <path d="M12 17h.01" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H4" />
      <path d="M20 4v16" />
    </svg>
  ),
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: icons.dashboard },
    { label: "Analysis", icon: icons.analysis },
    { label: "Docs & Tests", icon: icons.docs },
    { label: "Code Reviews", icon: icons.reviews },
    { label: "Settings", icon: icons.settings },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 bg-[#141a29] transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-100"
      }`}
    >
      <div className="flex h-full flex-col px-6 pb-8 pt-9">
        <div className={`${isCollapsed ? "flex justify-center" : "flex items-start justify-between gap-4"} mb-12`}>
          <div className={`flex ${isCollapsed ? "justify-center" : "items-start gap-5"}`}>
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="flex h-13 w-13 shrink-0 items-center justify-center rounded-md bg-[#042d22] text-[#10e7cd] shadow-[0_12px_30px_rgba(16,231,205,0.08)] transition-colors hover:bg-[#063b2d]"
                aria-label="Expand sidebar"
              >
                {icons.brand}
              </button>
            ) : (
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-md bg-[#042d22] text-[#10e7cd] shadow-[0_12px_30px_rgba(16,231,205,0.08)]">
                {icons.brand}
              </div>
            )}

            {!isCollapsed && (
              <div className="pt-0.5">
                <p className="font-['Space_Grotesk'] text-[1.65rem] font-bold leading-none tracking-tight text-[#10e7cd]">
                  Documate
                </p>
                <p className="mt-2 text-sm font-medium text-[#69758b]">v1.0.4</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md text-[#68758d] transition-colors hover:bg-[#20283a] hover:text-[#d8deef]"
              aria-label="Collapse sidebar"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
          )}

        </div>

        <nav className="flex-1 space-y-5">
          {navItems.map((item) => {
            const isActive = item.path && location.pathname === item.path;
            const itemClassName = `group relative flex transition-colors ${
              isCollapsed
                ? "justify-center rounded-lg px-0 py-4"
                : "items-center gap-5 rounded-lg px-5 py-4"
            } ${
              isActive
                ? "bg-[#272d3e] text-[#10e7cd]"
                : "text-[#78849a] hover:bg-[#1b2233] hover:text-[#d8deef]"
            }`;
            const itemContent = (
              <>
                {isActive && !isCollapsed && (
                  <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-[#10e7cd]" />
                )}

                <span className={`${isActive ? "text-[#10e7cd]" : "text-[#8995aa] group-hover:text-[#d8deef]"}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="text-[1.05rem] font-semibold tracking-tight">
                    {item.label}
                  </span>
                )}
              </>
            );

            if (!item.path) {
              return (
                <button
                  key={item.label}
                  type="button"
                  title={isCollapsed ? item.label : undefined}
                  className={`${itemClassName} w-full cursor-default text-left`}
                >
                  {itemContent}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={itemClassName}
              >
                {itemContent}
              </Link>
            );
          })}
        </nav>

        <div className={`space-y-5 pt-8 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          <button
            type="button"
            className={`group flex items-center text-[#78849a] transition-colors hover:text-[#d8deef] ${
              isCollapsed
                ? "justify-center rounded-lg p-3"
                : "w-full gap-5 rounded-lg px-5 py-2.5 text-left"
            }`}
            title={isCollapsed ? "Help" : undefined}
          >
            <span className="text-[#8995aa] group-hover:text-[#d8deef]">{icons.help}</span>
            {!isCollapsed && (
              <span className="text-sm font-semibold tracking-tight">Help</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className={`group flex items-center text-[#78849a] transition-colors hover:text-[#d8deef] ${
              isCollapsed
                ? "justify-center rounded-lg p-3"
                : "w-full gap-5 rounded-lg px-5 py-2.5 text-left"
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <span className="text-[#8995aa] group-hover:text-[#d8deef]">{icons.logout}</span>
            {!isCollapsed && (
              <span className="text-sm font-semibold tracking-tight">Logout</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
