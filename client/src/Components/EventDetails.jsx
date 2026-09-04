import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  Tag,
  CheckCircle,
  Users,
  Ticket,
  AlertCircle,
  Share2,
} from "lucide-react";
import { eventsAPI, registrationsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isStudent, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await eventsAPI.getById(id);
      if (res.success && res.event) {
        setEvent(res.event);
        setIsRegistered(Boolean(res.isRegistered));
        setRegistration(res.registration || null);
      }
    } catch (err) {
      console.error("Event fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleRegisterClick = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setSubmitting(true);
    setFeedback({ text: "", type: "" });

    try {
      const res = await registrationsAPI.register(id);
      if (res.success) {
        setIsRegistered(true);
        setRegistration(res.registration);
        setEvent((prev) => ({
          ...prev,
          registeredCount: (prev.registeredCount || 0) + 1,
        }));
        setFeedback({
          text: "Registration confirmed! Your spot is reserved.",
          type: "success",
        });
      }
    } catch (err) {
      setFeedback({
        text: err.message || "Failed to complete registration",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelClick = async () => {
    if (!window.confirm("Are you sure you want to cancel your event registration?")) {
      return;
    }

    setSubmitting(true);
    setFeedback({ text: "", type: "" });

    try {
      const res = await registrationsAPI.cancel(id);
      if (res.success) {
        setIsRegistered(false);
        setRegistration(null);
        setEvent((prev) => ({
          ...prev,
          registeredCount: Math.max(0, (prev.registeredCount || 1) - 1),
        }));
        setFeedback({
          text: "Your registration has been cancelled.",
          type: "info",
        });
      }
    } catch (err) {
      setFeedback({
        text: err.message || "Failed to cancel registration",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Event Not Found</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            The event you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/events"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const spotsLeft = Math.max(0, (event.capacity || 100) - (event.registeredCount || 0));
  const isFull = spotsLeft === 0;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-6xl shadow-inner">
              {event.icon || "📅"}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                  {event.category}
                </span>

                {isRegistered && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <CheckCircle size={14} />
                    You&apos;re Registered
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                {event.title}
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Organized by <strong className="text-white">{event.organizer || "Campus Council"}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Details Body */}
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {feedback.text && (
              <div
                className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-medium border ${
                  feedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 border-emerald-200"
                    : feedback.type === "info"
                    ? "bg-blue-50 text-blue-800 border-blue-200"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 border-rose-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Registration Confirmation Ticket if Registered */}
            {isRegistered && (
              <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50/50 p-6 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                    <Ticket size={22} className="text-emerald-600" />
                    Confirmed Student RSVP Pass
                  </div>
                  <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Active
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Attendee</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user?.name || "Student"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Pass Number</p>
                    <p className="font-bold font-mono text-indigo-700 mt-0.5">
                      {registration?.registrationNumber || "CC-2026-REGISTERED"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Department</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user?.department || "General"}</p>
                  </div>
                </div>

                <p className="mt-4 text-[11px] text-emerald-800/80 leading-relaxed border-t border-emerald-200/60 pt-3">
                  Please show this pass ID or student card at the event entrance for attendance verification.
                </p>
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-xs">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                About this event
              </h2>

              <p className="mt-5 leading-8 text-slate-600 dark:text-slate-400 whitespace-pre-line">
                {event.description}
              </p>

              <div className="mt-8 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  What to expect
                </h3>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                    <CheckCircle size={18} className="text-indigo-600 shrink-0" />
                    <span>Engage with students, faculty, and industry speakers</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                    <CheckCircle size={18} className="text-indigo-600 shrink-0" />
                    <span>Hands-on campus activities, showcases, and networking</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                    <CheckCircle size={18} className="text-indigo-600 shrink-0" />
                    <span>Official certificates of participation provided</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Information & Action Card */}
          <div>
            <div className="sticky top-24 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Event Information
              </h2>

              <div className="space-y-4">
                {/* Date */}
                <div className="flex gap-4">
                  <CalendarDays size={20} className="shrink-0 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Date</p>
                    <p className="mt-0.5 font-medium text-slate-900 dark:text-white text-sm">{event.date}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex gap-4">
                  <Clock size={20} className="shrink-0 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Time</p>
                    <p className="mt-0.5 font-medium text-slate-900 dark:text-white text-sm">{event.time}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4">
                  <MapPin size={20} className="shrink-0 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Location</p>
                    <p className="mt-0.5 font-medium text-slate-900 dark:text-white text-sm">{event.location}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex gap-4">
                  <Tag size={20} className="shrink-0 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Category</p>
                    <p className="mt-0.5 font-medium text-slate-900 dark:text-white text-sm">{event.category}</p>
                  </div>
                </div>

                {/* Capacity & Attendance */}
                <div className="flex gap-4">
                  <Users size={20} className="shrink-0 text-indigo-600 mt-0.5" />
                  <div className="w-full">
                    <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Attendance</p>
                    <p className="mt-0.5 font-medium text-slate-900 dark:text-white text-sm">
                      {event.registeredCount || 0} / {event.capacity} Registered
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              ((event.registeredCount || 0) / (event.capacity || 100)) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                {isRegistered ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-100 py-3 text-sm font-semibold text-emerald-800">
                      <CheckCircle size={18} />
                      Registered for this event
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelClick}
                      disabled={submitting}
                      className="w-full rounded-xl border border-rose-200 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      {submitting ? "Cancelling..." : "Cancel My Registration"}
                    </button>
                  </div>
                ) : isFull ? (
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-xl bg-slate-200 py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  >
                    Event is Full
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    disabled={submitting}
                    className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Register for Event"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EventDetails;