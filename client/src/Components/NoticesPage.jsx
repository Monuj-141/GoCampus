import { useState, useEffect } from "react";
import {
  Search,
  CalendarDays,
  ArrowRight,
  Megaphone,
  SlidersHorizontal,
  Building,
} from "lucide-react";
import { Link } from "react-router-dom";
import { noticesAPI } from "../services/api";

const categories = [
  "All",
  "Academic",
  "Scholarship",
  "Placement",
  "Examination",
  "Campus Life",
  "Sports",
  "General",
];

function NoticesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticesAPI.getAll({ search, category });
      if (res.success) {
        setNotices(res.notices || []);
      }
    } catch (err) {
      console.error("Fetch notices error:", err);
      setError("Unable to load campus notices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotices();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
            Campus Updates
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Latest Notices
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Stay updated with official announcements, examination circulars,
            scholarships, and campus placement drives.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Search and Filter */}
          <div className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Search notices by title, department, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:bg-white dark:bg-slate-900"
                />
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-slate-500 dark:text-slate-400" />

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
          </div>

          {/* Result Count */}
          <div className="mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {notices.length}
              </span>{" "}
              {notices.length === 1 ? "notice" : "notices"}
            </p>
          </div>

          {/* Notices List */}
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
                onClick={fetchNotices}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Retry Connecting
              </button>
            </div>
          ) : notices.length > 0 ? (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
                >
                  <div className="flex gap-5">
                    {/* Icon */}
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 sm:flex">
                      <Megaphone size={22} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* Title + Badges */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                          {notice.title}
                        </h2>

                        {notice.important && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-100">
                            Urgent Notice
                          </span>
                        )}
                      </div>

                      {/* Category & Department */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-0.5 font-semibold text-indigo-600">
                          {notice.category}
                        </span>

                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                          <Building size={13} className="text-slate-400 dark:text-slate-500" />
                          {notice.department || "All Departments"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                        {notice.description}
                      </p>

                      {/* Date */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <CalendarDays size={16} />
                        <span>{notice.date}</span>
                      </div>

                      {/* View */}
                      <Link
                        to={`/notices/${notice._id}`}
                        className="mt-5 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-white transition group-hover:text-indigo-600"
                      >
                        Read Full Notice
                        <ArrowRight size={17} />
                      </Link>
                    </div>

                    {/* Arrow */}
                    <div className="hidden text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600 sm:block">
                      <ArrowRight size={22} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Search size={24} className="text-slate-500 dark:text-slate-400" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                No notices found
              </h2>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Try searching for another notice or selecting a different category.
              </p>

              <button
                type="button"
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

export default NoticesPage;