
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: ArrowLeftRight,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setSidebarOpen(false);
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
      : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
    }`;

  const user = useSelector((state) => state.auth.user);

  const username =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/70 bg-slate-950 text-white transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-800/80 px-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-950/40">
            <Wallet size={23} strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight">
              FinTrack
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Personal Finance
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-8">
          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={linkClass}
              >
                <Icon size={20} strokeWidth={1.9} />

                <span className="flex-1">{name}</span>

                <ChevronRight
                  size={16}
                  className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-70"
                />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="mt-auto  border-t border-slate-800/80 p-4">


          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 cursor-pointer rounded-xl px-4 py-3.5 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>

          <p className="mt-4 px-4 text-[11px] text-slate-600">
            FinTrack · Expense & Finance Tracker
          </p>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen min-w-0 md:ml-72">
        {/* Top header */}

        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          {/* Left side */}
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Expense &amp; Finance Tracker
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Your personal financial workspace
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">
                Welcome back,
              </p>
              <p className="text-sm font-bold text-slate-900">
                Hi, {username}!
              </p>
            </div>

            <div
              className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-100 bg-violet-50 text-violet-700"
              title={username}
              aria-label={`User profile: ${username}`}
            >
              <UserRound size={22} strokeWidth={1.8} />
            </div>
          </div>
        </header>


        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
