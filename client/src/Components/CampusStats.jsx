import { useState, useEffect } from "react";
import {
  Users,
  CalendarDays,
  Megaphone,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { statsAPI } from "../services/api";

function CampusStats() {
  const [counts, setCounts] = useState({
    students: "1,000+",
    events: "50+",
    notices: "100+",
    departments: "10+",
  });

  useEffect(() => {
    statsAPI
      .getOverview()
      .then((res) => {
        if (res.success && res.stats) {
          const s = res.stats;
          setCounts({
            students: s.totalStudents ? `${s.totalStudents}+` : "100+",
            events: s.totalEvents ? `${s.totalEvents}+` : "12+",
            notices: s.totalNotices ? `${s.totalNotices}+` : "15+",
            departments: s.departmentsCount ? `${s.departmentsCount}+` : "8+",
          });
        }
      })
      .catch(() => {
        // Keeps graceful defaults
      });
  }, []);

  const stats = [
    {
      icon: Users,
      number: counts.students,
      label: "Active Students",
    },
    {
      icon: CalendarDays,
      number: counts.events,
      label: "Campus Events",
    },
    {
      icon: Megaphone,
      number: counts.notices,
      label: "Notices & Bulletins",
    },
    {
      icon: GraduationCap,
      number: counts.departments,
      label: "Departments",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 text-center transition duration-300 hover:-translate-y-1 hover:bg-white dark:bg-slate-900 hover:shadow-lg"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                  <Icon size={24} />
                </div>

                <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {stat.number}
                </h3>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-center sm:px-10 shadow-sm">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
              One Campus. One Platform.
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your campus. One connected platform.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              Discover events, stay updated with official notices, and connect with
              your campus community — all in one centralized hub.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3 font-semibold text-slate-900 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/events"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampusStats;