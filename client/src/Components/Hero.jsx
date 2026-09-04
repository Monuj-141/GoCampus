import {
  ArrowRight,
  CalendarDays,
  Bell,
  Users,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  return (
    <section className="relative overflow-hidden bg-slate-950">

      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">

        {/* =================================
            LEFT CONTENT
        ================================= */}
        <div>

          {/* Small badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-300">

            <Sparkles size={16} />

            <span>
              Your campus, connected
            </span>

          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">

            Connect.

            <br />

            <span className="text-indigo-400">
              Discover.
            </span>

            <br />

            Experience.

          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400 dark:text-slate-500">
            Everything happening around your campus,
            all in one place. Discover events, stay updated
            with notices and connect with your campus
            community.
          </p>

          {/* Buttons */}
          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                >
                  Sign In to Access
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Join CampusConnect
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/events"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                >
                  Explore Events
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  {isAdmin ? "Admin Portal" : "Student Dashboard"}
                </Link>
              </>
            )}
          </div>

          {/* Trust stats */}
          <div className="mt-10 flex flex-wrap gap-8 border-t border-slate-800 pt-8">

            <div>
              <p className="text-2xl font-bold text-white">
                50+
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Campus Events
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">
                1K+
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Students
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">
                24/7
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Campus Updates
              </p>
            </div>

          </div>

        </div>


        {/* =================================
            RIGHT VISUAL
        ================================= */}
        <div className="relative hidden lg:block">

          {/* Main card */}
          <div className="relative mx-auto max-w-md">

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-indigo-600/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

              {/* Card header */}
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    CampusConnect
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white">
                    Campus Overview
                  </h3>
                </div>

                <div className="rounded-xl bg-indigo-600 p-3 text-white">
                  <Sparkles size={20} />
                </div>

              </div>


              {/* Feature cards */}
              <div className="mt-8 space-y-4">

                {/* Events */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                  <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                    <CalendarDays size={22} />
                  </div>

                  <div className="flex-1">

                    <p className="font-semibold text-white">
                      Upcoming Events
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      TechFest • Sports Day
                    </p>

                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    04
                  </span>

                </div>


                {/* Notices */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                  <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                    <Bell size={22} />
                  </div>

                  <div className="flex-1">

                    <p className="font-semibold text-white">
                      Latest Notices
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Important campus updates
                    </p>

                  </div>

                  <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                    03
                  </span>

                </div>


                {/* Community */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                    <Users size={22} />
                  </div>

                  <div className="flex-1">

                    <p className="font-semibold text-white">
                      Campus Community
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Connect with students
                    </p>

                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-600 dark:text-slate-400"
                  />

                </div>

              </div>


              {/* Bottom */}
              <div className="mt-6 rounded-2xl bg-indigo-600 p-5">

                <p className="text-sm font-medium text-indigo-100">
                  Stay connected
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  Never miss what's happening.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;