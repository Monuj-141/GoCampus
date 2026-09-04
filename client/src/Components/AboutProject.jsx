import {
  CalendarDays,
  Bell,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Code2,
  Database,
  Lock,
  Smartphone,
  Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";

const CORE_MODULES = [
  {
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    title: "Event Management & 1-Click RSVP",
    description:
      "Explore upcoming technical symposiums, hackathons, sports tournaments, and cultural fests. Students register in 1 click and receive a unique digital pass code.",
    bullets: [
      "Dynamic spot countdown & capacity tracking",
      "Categorized filtering (Tech, Cultural, Sports)",
      "Instant RSVP confirmation with verified pass code",
    ],
  },
  {
    icon: Bell,
    color: "bg-amber-50 text-amber-600 border-amber-200",
    title: "Real-Time Official Notices",
    description:
      "Never miss exam circulars, placement drives, or scholarship deadlines. Instant priority badges ensure urgent notifications are never overlooked.",
    bullets: [
      "Department-wise notice filtering",
      "Urgent notice highlighting & priority banners",
      "Clean readability with rich announcement details",
    ],
  },
  {
    icon: Users,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    title: "Student Portal & Device Avatar",
    description:
      "A dedicated student workspace to track active event passes, cancel RSVPs if schedule changes, and update personal profiles with device photos.",
    bullets: [
      "Upload custom profile photo from device",
      "Active event ticket pass with cancellation support",
      "Personalized academic & department tracking",
    ],
  },
  {
    icon: ShieldCheck,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    title: "Role-Based Administrator Suite",
    description:
      "Empowers campus coordinators and faculty to publish circulars, create events, audit registrations, and view live campus-wide engagement metrics.",
    bullets: [
      "Secure JWT role authorization (Student vs Admin)",
      "Create, edit, and delete events & announcements",
      "Live attendee roster inspection & registrations audit",
    ],
  },
];

const TECH_STACK = [
  { name: "React 19 & Vite", role: "Blazing fast UI & component architecture", icon: Code2 },
  { name: "Node.js & Express", role: "RESTful API backend architecture", icon: Cpu },
  { name: "MongoDB Atlas", role: "Cloud NoSQL database with Mongoose schemas", icon: Database },
  { name: "JWT & Bcrypt", role: "Stateless security & password hashing", icon: Lock },
  { name: "Tailwind CSS", role: "Responsive modern mobile-first styling", icon: Layers },
  { name: "Device Responsive", role: "Flawless on smartphones, tablets & desktops", icon: Smartphone },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Authenticate",
    desc: "Log in with role-based credentials (or 1-click Demo buttons) as a Student or Administrator.",
  },
  {
    step: "02",
    title: "Discover & Engage",
    desc: "Browse upcoming college events, filter department circulars, or publish campus notices.",
  },
  {
    step: "03",
    title: "Connect & Participate",
    desc: "Reserve event seats with unique pass codes, customize your student profile, and stay in sync.",
  },
];

function AboutProject() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section of the Project */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-b border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-6">
            <Sparkles size={15} />
            ConnectCampus Full-Stack Platform
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
            The Digital Operating System for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
              Modern Campus Life
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            A comprehensive, role-based platform bridging students and administrators.
            Centralizing event discovery, digital ticket registrations, official circulars, and student profiles in one unified ecosystem.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              Sign In to Campus
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition"
            >
              Create Free Student Account
            </Link>
          </div>

          {/* Key Metrics Strip */}
         
        </div>
      </section>

      {/* Purpose & Why ConnectCampus */}
      <section className="py-20 bg-slate-900/60 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
              Project Purpose
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Why ConnectCampus Was Built
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              Traditional campus communication is fragmented across physical notice boards, scattered social media groups, and paper-based event registrations.
              ConnectCampus solves this by creating a verified, single source of truth for students and faculty.
            </p>
          </div>

          {/* Core Modules Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {CORE_MODULES.map(({ icon: Icon, color, title, description, bullets }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-md hover:border-slate-700 transition"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${color} mb-5`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{description}</p>

                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-slate-400 dark:text-slate-500">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow: How It Works */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
              User Experience
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              How ConnectCampus Operates
            </h2>
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
              Engineered with intuitive student workflows and rapid admin tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WORKFLOW_STEPS.map(({ step, title, desc }) => (
              <div
                key={step}
                className="relative rounded-3xl border border-slate-800 bg-slate-900/50 p-8 hover:bg-slate-900 transition"
              >
                <span className="text-4xl font-extrabold text-indigo-500/30">
                  {step}
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          

         

          {/* Bottom Call To Action Card */}
          <div className="mt-16 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-10 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Experience ConnectCampus Today
              </h3>
              <p className="mt-3 text-sm text-indigo-200/80">
                Log in with a 1-click Demo Account or sign up with your college email to explore the live portal.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/login"
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition"
                >
                  Go to Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  Register as Student
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutProject;
