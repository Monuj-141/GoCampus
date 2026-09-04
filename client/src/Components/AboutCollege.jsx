import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Compass,
  Building2,
  Sparkles,
  Laptop,
  Briefcase,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import collegeImg from "../assets/college.jpg";
import { useAuth } from "../context/AuthContext";

const HIGHLIGHTS = [
  {
    icon: Award,
    title: "NAAC Accredited",
    desc: "Recognized for academic rigor, modern infrastructure, and high educational standards.",
  },
  {
    icon: Laptop,
    title: "Modern Labs & Tech",
    desc: "Equipped with advanced computing centers, research suites, and high-speed Wi-Fi.",
  },
  {
    icon: Trophy,
    title: "Vibrant Campus Life",
    desc: "Annual cultural fests, sports tournaments, technical hackathons, and 20+ clubs.",
  },
  {
    icon: Briefcase,
    title: "Career & Placements",
    desc: "Active placement cell with industry tie-ups, internship programs, and guidance.",
  },
];

const STATS = [
  { value: "5,000+", label: "Active Students" },
  { value: "8+", label: "Departments" },
  { value: "50+", label: "Campus Clubs" },
  { value: "95%", label: "Placement Support" },
];

function AboutCollege() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-white dark:bg-slate-900 py-20 border-t border-slate-100 dark:border-slate-800/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            <GraduationCap size={16} />
            Our Institution
          </span>
          <h1 className="text-4xl mt-4 font-extrabold text-slate-900 dark:text-white">National Institute Of Technology, Agartala</h1>
          <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200 sm:text-4xl lg:text-3xl">
            Shaping Leaders, Inspiring Minds
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Welcome to our campus — a vibrant hub of learning, innovation, and community.
            We provide an empowering environment designed to nurture intellect, creativity, and professional excellence.
          </p>
        </div>

        {/* Hero Showcase Grid with college.jpg */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 mb-20">
          {/* College Photo Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group">
              <img
                src={collegeImg}
                alt="College Campus"
                className="w-full h-[400px] sm:h-[460px] object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 text-white">
                <div>
                  <p className="text-xs uppercase font-semibold tracking-wider text-indigo-300">
                    Main Campus
                  </p>
                  <h3 className="text-xl font-bold">
                    Center for Excellence & Innovation
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Academic Year
                </span>
              </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-indigo-500/10 blur-2xl" />
          </div>

          {/* College Description Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Building2 size={18} />
              About Our Campus
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              A Modern Environment Dedicated to Comprehensive Student Growth
            </h3>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              Our institution has stood as a beacon of academic rigor and student-centric education.
              With cutting-edge curriculum spanning Computer Science, Information Technology, Engineering,
              Business Administration, and Applied Sciences, we prepare our scholars to thrive in an ever-evolving global landscape.
            </p>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              Beyond academics, our campus thrives with vibrant cultural societies, coding hackathons, athletic tournaments,
              and collaborative workshops designed to foster innovation, character, and lifelong professional skills.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    <BookOpen size={16} />
                    Open My Dashboard
                  </Link>
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                  >
                    <Compass size={16} />
                    Explore Events
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    <Sparkles size={16} />
                    Sign In to Portal
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                  >
                    <Users size={16} />
                    Student Registration
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:border-indigo-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 mb-4">
                <Icon size={22} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* College Key Numbers Strip */}
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {STATS.map(({ value, label }) => (
              <div key={label} className="pt-4 md:pt-0">
                <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
                  {value}
                </p>
                <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutCollege;
