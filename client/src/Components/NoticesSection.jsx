import { useState, useEffect } from "react";
import { ArrowRight, CalendarDays, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { noticesAPI } from "../services/api";

const fallbackNotices = [
  {
    _id: "1",
    title: "Semester Examination Form",
    description: "Students are requested to submit their semester examination form before the deadline.",
    date: "September 10, 2026",
    important: true,
  },
  {
    _id: "2",
    title: "Scholarship Application",
    description: "Eligible students can submit their scholarship applications through the college portal.",
    date: "September 15, 2026",
    important: true,
  },
  {
    _id: "3",
    title: "Campus Placement Drive",
    description: "Registration is now open for the upcoming campus placement drive.",
    date: "September 20, 2026",
    important: false,
  },
];

function NoticesSection() {
  const [notices, setNotices] = useState(fallbackNotices);

  useEffect(() => {
    noticesAPI
      .getAll()
      .then((res) => {
        if (res.success && res.notices && res.notices.length > 0) {
          setNotices(res.notices.slice(0, 3));
        }
      })
      .catch(() => {
        // Fallback remains
      });
  }, []);

  return (
    <section className="bg-slate-50 dark:bg-slate-950 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Stay Updated
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Latest Notices
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Stay informed about important announcements and updates from your
              college.
            </p>
          </div>

          <Link
            to="/notices"
            className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:gap-3"
          >
            View all notices
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Notices */}
        <div className="space-y-4">
          {notices.map((notice) => (
            <Link
              key={notice._id}
              to={`/notices/${notice._id}`}
              className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                  <Megaphone size={22} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                      {notice.title}
                    </h3>

                    {notice.important && (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-100">
                        Important
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {notice.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <CalendarDays size={16} />
                    <span>{notice.date}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden text-slate-400 dark:text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-600 sm:block">
                  <ArrowRight size={22} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NoticesSection;