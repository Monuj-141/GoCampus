import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Shield,
  Ticket,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >
          <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-sm">
            <GraduationCap size={23} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus
            <span className="text-indigo-600">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation - Only visible when authenticated */}
        {isAuthenticated && (
          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/events" className={navLinkClass}>
              Events
            </NavLink>

            <NavLink to="/map" className={navLinkClass}>
              Campus Map
            </NavLink>

            <NavLink to="/notices" className={navLinkClass}>
              Notices
            </NavLink>

            {isStudent && (
              <NavLink to="/dashboard" className={navLinkClass}>
                My Dashboard
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`
                }
              >
                <Shield size={14} />
                Admin Portal
              </NavLink>
            )}
          </div>
        )}

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle color theme"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white uppercase">
                    {user.name ? user.name[0] : "U"}
                  </div>
                )}
                <div className="hidden text-xs lg:block">
                  <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                    {user.name}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl">
                  <div className="border-b border-slate-100 dark:border-slate-800/60 px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-[10px] font-medium text-indigo-600 uppercase">
                      {user.role}
                    </span>
                  </div>

                  {isStudent && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-950"
                      >
                        <LayoutDashboard size={16} className="text-indigo-600" />
                        Student Dashboard
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-950"
                      >
                        <Ticket size={16} className="text-indigo-600" />
                        My Registrations
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-950"
                    >
                      <Shield size={16} className="text-purple-600" />
                      Admin Control Center
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-950"
                  >
                    <UserIcon size={16} className="text-slate-500 dark:text-slate-400" />
                    My Profile
                  </Link>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800/60" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Navigation - Only for authenticated users */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5 md:hidden">
          <div className="flex flex-col gap-2">
            {isAuthenticated && (
              <div className="mb-2 rounded-xl bg-slate-50 dark:bg-slate-950 p-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                <span className="mt-1 inline-block rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 uppercase">
                  {user.role}
                </span>
              </div>
            )}

            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`
              }
            >
              Events
            </NavLink>

            <NavLink
              to="/notices"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`
              }
            >
              Notices
            </NavLink>

            {isAuthenticated && isStudent && (
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`
                }
              >
                My Dashboard
              </NavLink>
            )}

            {isAuthenticated && isAdmin && (
              <NavLink
                to="/admin"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold"
                      : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                  }`
                }
              >
                Admin Portal
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`
                }
              >
                My Profile
              </NavLink>
            )}

            <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;