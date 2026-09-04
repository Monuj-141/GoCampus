import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
  AlertCircle,
  ArrowRight,
  Trash2,
  Sparkles,
  BookOpen,
  Megaphone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { registrationsAPI, noticesAPI } from "../services/api";

function StudentDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [departmentNotices, setDepartmentNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
  const [cancellingId, setCancellingId] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [regRes, noticesRes] = await Promise.all([
        registrationsAPI.getMy(),
        noticesAPI.getAll(),
      ]);

      if (regRes.success) {
        setRegistrations(regRes.registrations || []);
      }

      if (noticesRes.success) {
        // filter or sort notices relevant to student
        setDepartmentNotices(noticesRes.notices.slice(0, 3));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelRegistration = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      return;
    }

    setCancellingId(eventId);
    try {
      const res = await registrationsAPI.cancel(eventId);
      if (res.success) {
        setRegistrations((prev) =>
          prev.filter((r) => r.event?._id !== eventId && r.event !== eventId)
        );
        setActionMessage({
          text: `Registration for "${eventTitle}" has been cancelled.`,
          type: "success",
        });
        setTimeout(() => setActionMessage({ text: "", type: "" }), 4000);
      }
    } catch (err) {
      setActionMessage({
        text: err.message || "Failed to cancel registration",
        type: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || "Student"}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shrink-0"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white uppercase shadow-md shrink-0">
                {user?.name ? user.name[0] : "S"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                <Sparkles size={16} />
                Student Portal
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Hello, {user?.name || "Student"}!
              </h1>
              <p className="mt-1 text-slate-300 max-w-xl text-xs sm:text-sm leading-relaxed">
                Track your registered events, access registration passes, and stay updated with campus announcements.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
            >
              <CalendarDays size={16} />
              Browse Events
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Action Flash Message */}
        {actionMessage.text && (
          <div
            className={`mt-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium border ${
              actionMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 border-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 border-rose-200"
            }`}
          >
            <AlertCircle size={18} />
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Quick Stat Badges */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                Registered Events
              </span>
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-2.5 text-indigo-600">
                <Ticket size={20} />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {registrations.length}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Confirmed registrations</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                Department
              </span>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <BookOpen size={20} />
              </div>
            </div>
            <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white truncate">
              {user?.department || "Computer Science"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{user?.year || "Undergraduate"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                Student ID
              </span>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-emerald-600">
                <Ticket size={20} />
              </div>
            </div>
            <p className="mt-2 text-lg font-bold font-mono text-slate-900 dark:text-white">
              {user?.studentId || "CC2026-CS-042"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Verified campus profile</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                Campus Notices
              </span>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-2.5 text-amber-600">
                <Megaphone size={20} />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {departmentNotices.length}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Active announcements</p>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registered Events List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket size={22} className="text-indigo-600" />
                My Registered Events ({registrations.length})
              </h2>
              <Link
                to="/events"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Find more <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 text-3xl">
                  🎟️
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  No registered events yet
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Explore tech hackathons, cultural festivals, sports tournaments, and workshops happening on campus!
                </p>
                <Link
                  to="/events"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Explore Upcoming Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => {
                  const ev = reg.event;
                  if (!ev) return null;

                  return (
                    <div
                      key={reg._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-3xl">
                          {ev.icon || "📅"}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                              {ev.category}
                            </span>
                            <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                              Confirmed
                            </span>
                          </div>

                          <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
                            {ev.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={14} className="text-indigo-600" />
                              {ev.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} className="text-indigo-600" />
                              {ev.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} className="text-indigo-600" />
                              {ev.location}
                            </span>
                          </div>

                          <div className="mt-2.5">
                            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                              Pass ID: <strong className="text-slate-700 dark:text-slate-300">{reg.registrationNumber}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
                        <Link
                          to={`/events/${ev._id}`}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          View Event
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleCancelRegistration(ev._id, ev.title)}
                          disabled={cancellingId === ev._id}
                          className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 transition"
                        >
                          <Trash2 size={13} />
                          {cancellingId === ev._id ? "Cancelling..." : "Cancel RSVP"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar: Campus Notices */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone size={22} className="text-indigo-600" />
                Latest Notices
              </h2>
              <Link
                to="/notices"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                All notices <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
              {departmentNotices.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent notices found.</p>
              ) : (
                departmentNotices.map((notice) => (
                  <Link
                    key={notice._id}
                    to={`/notices/${notice._id}`}
                    className="block group rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-950 transition border border-transparent hover:border-slate-100 dark:hover:border-slate-800/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-indigo-600 uppercase">
                        {notice.category}
                      </span>
                      {notice.important && (
                        <span className="rounded-full bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                          Urgent
                        </span>
                      )}
                    </div>
                    <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                      {notice.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {notice.description}
                    </p>
                    <span className="mt-2 block text-[11px] text-slate-400 dark:text-slate-500">
                      {notice.date} • {notice.department}
                    </span>
                  </Link>
                ))
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <Link
                  to="/notices"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  View All Campus Announcements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
