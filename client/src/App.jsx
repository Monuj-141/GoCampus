import { Component } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import EventsSection from "./Components/EventsSection";
import NoticesSection from "./Components/NoticesSection";
import CampusStats from "./Components/CampusStats";
import AboutProject from "./Components/AboutProject";
import AboutCollege from "./Components/AboutCollege";
import EventsPage from "./Components/EventsPage";
import EventDetails from "./Components/EventDetails";
import NoticesPage from "./Components/NoticesPage";
import NoticeDetails from "./Components/NoticeDetails";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import VerifyEmail from "./Components/VerifyEmail";
import StudentDashboard from "./Components/StudentDashboard";
import ProfilePage from "./Components/ProfilePage";
import AdminDashboard from "./Components/AdminDashboard";
import CampusMap from "./Components/CampusMap";

function Home() {
  const { isAuthenticated } = useAuth();

  // Before login/signup: show page telling about the project ONLY
  if (!isAuthenticated) {
    return <AboutProject />;
  }

  // After login: show college campus showcase featuring college.jpg (no connect/discover banner)
  return <AboutCollege />;
}

// Smart Dashboard Route helper: directs students to StudentDashboard and admins to AdminDashboard
function DashboardRoute() {
  const { isAdmin } = useAuth();
  if (isAdmin) {
    return <AdminDashboard />;
  }
  return <StudentDashboard />;
}

// Protected Route for Authenticated Users (Student / Admin)
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Admin Route for Campus Administrators
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-md w-full rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold mb-4">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Application Error</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {this.state.error?.message || "An unexpected error occurred while rendering."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans">
            <Navbar />

            <div className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />

                {/* Campus Content Routes - Only accessible after login */}
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute>
                      <EventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/:id"
                  element={
                    <ProtectedRoute>
                      <EventDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notices"
                  element={
                    <ProtectedRoute>
                      <NoticesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notices/:id"
                  element={
                    <ProtectedRoute>
                      <NoticeDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <ProtectedRoute>
                      <CampusMap />
                    </ProtectedRoute>
                  }
                />

                {/* Dashboard Route (Student & Admin) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardRoute />
                    </ProtectedRoute>
                  }
                />

                {/* Shared Profile Route */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Administrator Workflow Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;