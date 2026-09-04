import { useState, useEffect } from "react";
import {
  Search,
  CalendarDays,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { eventsAPI } from "../services/api";

const categories = [
  "All",
  "Technology",
  "Sports",
  "Hackathon",
  "Cultural",
  "Academic",
  "Workshop",
];

function EventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventsAPI.getAll({ search, category });
      if (res.success) {
        setEvents(res.events || []);
      }
    } catch (err) {
      console.error("Fetch events error:", err);
      setError("Unable to load events from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debounce search
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Page Header */}
      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
            Campus Activities
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Explore Events
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Discover upcoming events, competitions, hackathons, and workshops
            happening across the campus community.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Search + Filter */}
          <div className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Search by title, location, or keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:bg-white dark:bg-slate-900"
                />
              </div>

              {/* Filter Label */}
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <SlidersHorizontal size={18} />
                Category
              </div>

              {/* Category Dropdown */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {events.length}
              </span>{" "}
              {events.length === 1 ? "event" : "events"}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center text-rose-800">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 text-xl font-bold mb-3">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Unable to Connect to Campus Server
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-5">
                The backend API server (port 5000) was temporarily unreachable. Please ensure the backend is running.
              </p>
              <button
                type="button"
                onClick={fetchEvents}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Retry Connecting
              </button>
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const spotsRemaining = Math.max(
                  0,
                  (event.capacity || 100) - (event.registeredCount || 0)
                );

                return (
                  <div
                    key={event._id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div>
                      {/* Visual Banner */}
                      <div className="flex h-48 items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-blue-500 text-white">
                        <span className="text-7xl transition duration-300 group-hover:scale-110">
                          {event.icon || "📅"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-600">
                            {event.category}
                          </span>

                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <Users size={13} className="text-indigo-600" />
                            {spotsRemaining > 0
                              ? `${spotsRemaining} spots left`
                              : "Full"}
                          </span>
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                          {event.title}
                        </h2>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {event.description}
                        </p>

                        {/* Date */}
                        <div className="mt-5 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <CalendarDays
                            size={18}
                            className="shrink-0 text-indigo-600"
                          />
                          <span>{event.date}</span>
                        </div>

                        {/* Location */}
                        <div className="mt-3 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin
                            size={18}
                            className="shrink-0 text-indigo-600"
                          />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        By {event.organizer || "Student Council"}
                      </span>
                      <Link
                        to={`/events/${event._id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                      >
                        View & Register
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Search size={24} className="text-slate-500 dark:text-slate-400" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                No events found
              </h2>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Try adjusting your search terms or selecting a different
                category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default EventsPage;