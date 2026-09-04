import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, AlertCircle, Building, User } from "lucide-react";
import { noticesAPI } from "../services/api";

function NoticeDetails() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);
      try {
        const res = await noticesAPI.getById(id);
        if (res.success && res.notice) {
          setNotice(res.notice);
        }
      } catch (err) {
        console.error("Notice fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-rose-500" />
          <h1 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
            Notice Not Found
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            The notice you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/notices"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Back to Notices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          to="/notices"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Notices
        </Link>

        {/* Notice Card */}
        <article className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-700">
                {notice.category}
              </span>

              {notice.important && (
                <span className="flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                  <AlertCircle size={14} />
                  Urgent Notice
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl">
              {notice.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-indigo-600" />
                {notice.date}
              </div>

              <div className="flex items-center gap-1.5">
                <Building size={16} className="text-indigo-600" />
                {notice.department || "All Departments"}
              </div>

              {notice.author && (
                <div className="flex items-center gap-1.5">
                  <User size={16} className="text-indigo-600" />
                  {notice.author}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/70 p-8 md:p-10">
            <p className="text-base font-medium leading-8 text-slate-700 dark:text-slate-300">
              {notice.description}
            </p>
          </div>

          {/* Full Content */}
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Detailed Instructions & Circular
            </h2>

            <div className="mt-6 whitespace-pre-line text-sm leading-8 text-slate-600 dark:text-slate-400">
              {notice.content}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-between">
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft size={16} />
              Back to All Notices
            </Link>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              Campus Administration Bulletin
            </span>
          </div>
        </article>
      </div>
    </div>
  );
}

export default NoticeDetails;