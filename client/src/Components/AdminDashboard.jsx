import { useState, useEffect } from "react";
import {
  Shield,
  Calendar,
  Megaphone,
  Users,
  Ticket,
  Plus,
  Trash2,
  Edit,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
  Clock,
  MapPin,
} from "lucide-react";
import { eventsAPI, noticesAPI, registrationsAPI, statsAPI } from "../services/api";

const EVENT_CATEGORIES = [
  "Technology",
  "Sports",
  "Hackathon",
  "Cultural",
  "Academic",
  "Workshop",
  "Seminar",
  "Other",
];

const NOTICE_CATEGORIES = [
  "Academic",
  "Scholarship",
  "Placement",
  "Examination",
  "Campus Life",
  "Sports",
  "General",
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("events"); // 'events' | 'notices' | 'registrations'
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    category: "Technology",
    date: "",
    time: "",
    location: "",
    description: "",
    icon: "💻",
    capacity: 100,
    organizer: "Campus Student Council",
    featured: false,
  });

  const [attendeesModalOpen, setAttendeesModalOpen] = useState(false);
  const [currentEventAttendees, setCurrentEventAttendees] = useState([]);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);

  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeFormData, setNoticeFormData] = useState({
    title: "",
    category: "Academic",
    department: "All Departments",
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    important: false,
    description: "",
    content: "",
    author: "Campus Administration",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ text: "", type: "" });

  const showAlert = (text, type = "success") => {
    setAlert({ text, type });
    setTimeout(() => setAlert({ text: "", type: "" }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, eventsRes, noticesRes, regRes] = await Promise.all([
        statsAPI.getOverview(),
        eventsAPI.getAll(),
        noticesAPI.getAll(),
        registrationsAPI.getAll(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (eventsRes.success) setEvents(eventsRes.events || []);
      if (noticesRes.success) setNotices(noticesRes.notices || []);
      if (regRes.success) setRegistrations(regRes.registrations || []);
    } catch (err) {
      console.error("Admin load error:", err);
      showAlert(err.message || "Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Event handlers
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      category: "Technology",
      date: "",
      time: "10:00 AM - 4:00 PM",
      location: "",
      description: "",
      icon: "💻",
      capacity: 100,
      organizer: "Campus Student Council",
      featured: false,
    });
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventFormData({
      title: ev.title,
      category: ev.category,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      description: ev.description,
      icon: ev.icon || "💻",
      capacity: ev.capacity || 100,
      organizer: ev.organizer || "Campus Student Council",
      featured: Boolean(ev.featured),
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const res = await eventsAPI.update(editingEvent._id, eventFormData);
        if (res.success) {
          showAlert("Event updated successfully!");
          setEvents((prev) =>
            prev.map((item) => (item._id === editingEvent._id ? res.event : item))
          );
        }
      } else {
        const res = await eventsAPI.create(eventFormData);
        if (res.success) {
          showAlert("New event published successfully!");
          setEvents((prev) => [res.event, ...prev]);
        }
      }
      setEventModalOpen(false);
    } catch (err) {
      showAlert(err.message || "Failed to save event", "error");
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await eventsAPI.delete(id);
      if (res.success) {
        showAlert("Event deleted");
        setEvents((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      showAlert(err.message || "Failed to delete event", "error");
    }
  };

  const handleViewAttendees = async (ev) => {
    setSelectedEventForAttendees(ev);
    try {
      const res = await eventsAPI.getAttendees(ev._id);
      if (res.success) {
        setCurrentEventAttendees(res.attendees || []);
      }
      setAttendeesModalOpen(true);
    } catch (err) {
      showAlert(err.message || "Failed to fetch attendees", "error");
    }
  };

  // Notice handlers
  const handleOpenAddNotice = () => {
    setEditingNotice(null);
    setNoticeFormData({
      title: "",
      category: "Academic",
      department: "All Departments",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      important: false,
      description: "",
      content: "",
      author: "Campus Administration",
    });
    setNoticeModalOpen(true);
  };

  const handleOpenEditNotice = (n) => {
    setEditingNotice(n);
    setNoticeFormData({
      title: n.title,
      category: n.category,
      department: n.department || "All Departments",
      date: n.date,
      important: Boolean(n.important),
      description: n.description,
      content: n.content,
      author: n.author || "Campus Administration",
    });
    setNoticeModalOpen(true);
  };

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        const res = await noticesAPI.update(editingNotice._id, noticeFormData);
        if (res.success) {
          showAlert("Notice updated successfully!");
          setNotices((prev) =>
            prev.map((item) => (item._id === editingNotice._id ? res.notice : item))
          );
        }
      } else {
        const res = await noticesAPI.create(noticeFormData);
        if (res.success) {
          showAlert("Notice published successfully!");
          setNotices((prev) => [res.notice, ...prev]);
        }
      }
      setNoticeModalOpen(false);
    } catch (err) {
      showAlert(err.message || "Failed to save notice", "error");
    }
  };

  const handleDeleteNotice = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await noticesAPI.delete(id);
      if (res.success) {
        showAlert("Notice removed");
        setNotices((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      showAlert(err.message || "Failed to delete notice", "error");
    }
  };

  // Filtered lists
  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2">
              <Shield size={16} />
              Administrative Control Center
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Campus Administration
            </h1>
            <p className="mt-2 text-purple-200 text-sm max-w-xl">
              Manage campus events, publish bulletins and notices, monitor student registrations, and view attendee lists.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAddEvent}
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-purple-950 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition shadow-sm"
            >
              <Plus size={16} />
              New Event
            </button>
            <button
              onClick={handleOpenAddNotice}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 border border-purple-400/40 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm"
            >
              <Plus size={16} />
              Publish Notice
            </button>
          </div>
        </div>

        {/* Alert Feedback */}
        {alert.text && (
          <div
            className={`mt-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium border ${
              alert.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 border-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 border-rose-200"
            }`}
          >
            {alert.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alert.text}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Total Students</span>
              <Users size={18} className="text-indigo-600" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {stats?.totalStudents ?? "..."}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Active campus accounts</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Active Events</span>
              <Calendar size={18} className="text-purple-600" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {events.length}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Scheduled on platform</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Campus Notices</span>
              <Megaphone size={18} className="text-amber-600" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {notices.length}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Published announcements</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Total RSVPs</span>
              <Ticket size={18} className="text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {registrations.length}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Student event registrations</p>
          </div>
        </div>

        {/* Tab Selector & Search Bar */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("events");
                setSearchTerm("");
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "events"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Events Management ({events.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("notices");
                setSearchTerm("");
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "notices"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Notices Management ({notices.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("registrations");
                setSearchTerm("");
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "registrations"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              All Registrations ({registrations.length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white focus:border-purple-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Tab 1: Events Management */}
        {activeTab === "events" && (
          <div className="mt-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">RSVP / Cap</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                          No events found.
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((ev) => (
                        <tr key={ev._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{ev.icon || "📅"}</span>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{ev.title}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{ev.organizer}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                              {ev.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <p className="font-medium text-slate-900 dark:text-white">{ev.date}</p>
                            <p className="text-slate-400 dark:text-slate-500">{ev.time}</p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 truncate max-w-xs">
                            {ev.location}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {ev.registeredCount || 0}
                            </span>{" "}
                            / {ev.capacity}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewAttendees(ev)}
                                title="View Attendees"
                                className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                              >
                                <Eye size={17} />
                              </button>
                              <button
                                onClick={() => handleOpenEditEvent(ev)}
                                title="Edit Event"
                                className="rounded-lg p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              >
                                <Edit size={17} />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(ev._id, ev.title)}
                                title="Delete Event"
                                className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Notices Management */}
        {activeTab === "notices" && (
          <div className="mt-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Notice Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredNotices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                          No notices found.
                        </td>
                      </tr>
                    ) : (
                      filteredNotices.map((n) => (
                        <tr key={n._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition">
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                            {n.title}
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-md bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 text-xs font-semibold text-purple-700">
                              {n.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                            {n.department || "All Departments"}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                            {n.date}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {n.important ? (
                              <span className="rounded-full bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                                Urgent
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                                Regular
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditNotice(n)}
                                title="Edit Notice"
                                className="rounded-lg p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              >
                                <Edit size={17} />
                              </button>
                              <button
                                onClick={() => handleDeleteNotice(n._id, n.title)}
                                title="Delete Notice"
                                className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Registrations Management */}
        {activeTab === "registrations" && (
          <div className="mt-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Department & Year</th>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Pass / ID</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                          No student registrations found.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900 dark:text-white">{reg.student?.name || "Student"}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{reg.student?.email}</p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                            <p>{reg.student?.department || "N/A"}</p>
                            <p className="text-slate-400 dark:text-slate-500">{reg.student?.year || ""}</p>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {reg.event?.title || "Event"}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-indigo-600 font-bold">
                            {reg.registrationNumber}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create/Edit Event */}
        {eventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h3>
                <button
                  onClick={() => setEventModalOpen(false)}
                  className="rounded-xl p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                    placeholder="e.g. AI & Robotics Symposium 2026"
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      value={eventFormData.category}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, category: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    >
                      {EVENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      value={eventFormData.icon}
                      onChange={(e) => setEventFormData({ ...eventFormData, icon: e.target.value })}
                      placeholder="💻 or 🚀 or 🏆"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Date
                    </label>
                    <input
                      type="text"
                      required
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                      placeholder="e.g. November 10, 2026"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Time
                    </label>
                    <input
                      type="text"
                      required
                      value={eventFormData.time}
                      onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                      placeholder="e.g. 10:00 AM - 3:00 PM"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Location / Hall
                    </label>
                    <input
                      type="text"
                      required
                      value={eventFormData.location}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, location: e.target.value })
                      }
                      placeholder="e.g. Main Auditorium"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={eventFormData.capacity}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, capacity: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    value={eventFormData.organizer}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, organizer: e.target.value })
                    }
                    placeholder="e.g. Robotics Club"
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Event Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={eventFormData.description}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, description: e.target.value })
                    }
                    placeholder="Describe event schedule, highlights, eligibility, etc."
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-3 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setEventModalOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition"
                  >
                    {editingEvent ? "Save Changes" : "Publish Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View Attendees */}
        {attendeesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Registered Attendees
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Event: <strong>{selectedEventForAttendees?.title}</strong> ({currentEventAttendees.length} students)
                  </p>
                </div>
                <button
                  onClick={() => setAttendeesModalOpen(false)}
                  className="rounded-xl p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6">
                {currentEventAttendees.length === 0 ? (
                  <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    No students have registered for this event yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3">Student Name</th>
                          <th className="px-4 py-3">ID / Roll No</th>
                          <th className="px-4 py-3">Department</th>
                          <th className="px-4 py-3">Year</th>
                          <th className="px-4 py-3">Pass Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentEventAttendees.map((att) => (
                          <tr key={att._id}>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-900 dark:text-white">{att.student?.name}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">{att.student?.email}</p>
                            </td>
                            <td className="px-4 py-3 text-xs font-mono">
                              {att.student?.studentId || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {att.student?.department || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {att.student?.year || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-xs font-mono font-bold text-indigo-600">
                              {att.registrationNumber}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setAttendeesModalOpen(false)}
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create/Edit Notice */}
        {noticeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingNotice ? "Edit Notice" : "Publish Campus Notice"}
                </h3>
                <button
                  onClick={() => setNoticeModalOpen(false)}
                  className="rounded-xl p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveNotice} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeFormData.title}
                    onChange={(e) =>
                      setNoticeFormData({ ...noticeFormData, title: e.target.value })
                    }
                    placeholder="e.g. Mid-Semester Timetable Released"
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      value={noticeFormData.category}
                      onChange={(e) =>
                        setNoticeFormData({ ...noticeFormData, category: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    >
                      {NOTICE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Department
                    </label>
                    <input
                      type="text"
                      value={noticeFormData.department}
                      onChange={(e) =>
                        setNoticeFormData({ ...noticeFormData, department: e.target.value })
                      }
                      placeholder="e.g. Examination Cell or All Departments"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Publish Date
                    </label>
                    <input
                      type="text"
                      required
                      value={noticeFormData.date}
                      onChange={(e) =>
                        setNoticeFormData({ ...noticeFormData, date: e.target.value })
                      }
                      placeholder="September 15, 2026"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Author / Department Head
                    </label>
                    <input
                      type="text"
                      value={noticeFormData.author}
                      onChange={(e) =>
                        setNoticeFormData({ ...noticeFormData, author: e.target.value })
                      }
                      placeholder="Controller of Examinations"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="urgentCheckbox"
                    checked={noticeFormData.important}
                    onChange={(e) =>
                      setNoticeFormData({ ...noticeFormData, important: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="urgentCheckbox" className="text-xs font-semibold text-rose-600">
                    Mark this announcement as URGENT / HIGH PRIORITY
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Brief Summary / Description
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeFormData.description}
                    onChange={(e) =>
                      setNoticeFormData({ ...noticeFormData, description: e.target.value })
                    }
                    placeholder="Short summary displayed on list view..."
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Full Content & Instructions
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={noticeFormData.content}
                    onChange={(e) =>
                      setNoticeFormData({ ...noticeFormData, content: e.target.value })
                    }
                    placeholder="Detailed notice text, guidelines, dead-lines, etc."
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-3 text-sm text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setNoticeModalOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition"
                  >
                    {editingNotice ? "Save Changes" : "Publish Notice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
