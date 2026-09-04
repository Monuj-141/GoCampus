import { useState, useEffect } from "react";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { eventsAPI } from "../services/api";

const fallbackEvents = [
  {
    _id: "1",
    title: "Tech Fest 2026",
    category: "Technology",
    date: "September 15, 2026",
    location: "Computer Science Department",
    description: "Explore technology, coding challenges, innovation and exciting projects.",
    icon: "💻",
  },
  {
    _id: "2",
    title: "Annual Sports Day",
    category: "Sports",
    date: "September 20, 2026",
    location: "College Sports Ground",
    description: "A day full of competition, teamwork and unforgettable campus moments.",
    icon: "🏆",
  },
  {
    _id: "3",
    title: "Campus Hackathon",
    category: "Hackathon",
    date: "October 5, 2026",
    location: "Innovation Lab",
    description: "Build innovative solutions, collaborate with students and win exciting prizes.",
    icon: "🚀",
  },
];

function EventsSection() {
  const [events, setEvents] = useState(fallbackEvents);

  useEffect(() => {
    eventsAPI
      .getAll()
      .then((res) => {
        if (res.success && res.events && res.events.length > 0) {
          setEvents(res.events.slice(0, 3));
        }
      })
      .catch(() => {
        // Fallback remains
      });
  }, []);

  return (
    <section className="bg-white dark:bg-slate-900 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Campus Activities
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Upcoming Events
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Discover what&apos;s happening on campus and never miss an important
              event.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:gap-3"
          >
            View all events
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Event Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Event Visual */}
              <div className="flex h-48 items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-blue-500">
                <span className="text-7xl transition duration-300 group-hover:scale-110">
                  {event.icon || "📅"}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {event.category}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  {event.title}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {event.description}
                </p>

                <div className="mt-5 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <CalendarDays size={18} className="shrink-0 text-indigo-600" />
                  <span>{event.date}</span>
                </div>

                <div className="mt-3 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={18} className="shrink-0 text-indigo-600" />
                  <span className="truncate">{event.location}</span>
                </div>

                <Link
                  to={`/events/${event._id}`}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-white transition group-hover:text-indigo-600"
                >
                  View Details
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventsSection;