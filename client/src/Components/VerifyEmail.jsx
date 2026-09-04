import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { GraduationCap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function VerifyEmail() {
  const { token } = useParams();
  const { isAuthenticated, refreshUser } = useAuth();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const verify = async () => {
      try {
        const res = await authAPI.verifyEmail(token);
        setStatus("success");
        setMessage(res.message || "Email verified successfully!");
        if (isAuthenticated) {
          refreshUser();
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "This verification link is invalid or has expired.");
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-sm">
            <GraduationCap size={26} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus<span className="text-indigo-600">Connect</span>
          </span>
        </Link>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm">
          {status === "verifying" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                <Loader2 size={28} className="animate-spin" />
              </div>
              <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Verifying your email...</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Just a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <CheckCircle2 size={28} />
              </div>
              <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Email verified!</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{message}</p>
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                {isAuthenticated ? "Go to My Profile" : "Continue to Sign In"}
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
                <AlertCircle size={28} />
              </div>
              <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Verification failed</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{message}</p>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                You can request a new verification email from your{" "}
                <Link to="/profile" className="font-semibold text-indigo-600 hover:underline">
                  profile page
                </Link>{" "}
                after signing in.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
