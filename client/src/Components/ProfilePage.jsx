import { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  Camera,
  Trash2,
  Upload,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Biotechnology",
  "Dean Office",
];

const YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Postgraduate",
  "Faculty",
];

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    department: "Computer Science",
    year: "3rd Year",
    studentId: "",
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");

  // Sync state with current authenticated user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        department: user.department || "Computer Science",
        year: user.year || "3rd Year",
        studentId: user.studentId || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [passMsg, setPassMsg] = useState({ text: "", type: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  const handleResendVerification = async () => {
    setResendingVerification(true);
    setVerifyMsg("");
    try {
      const res = await authAPI.resendVerification();
      setVerifyMsg(res.message || "Verification email sent. Please check your inbox.");
    } catch (err) {
      setVerifyMsg(err.message || "Failed to resend verification email.");
    } finally {
      setResendingVerification(false);
    }
  };

  // Resize and compress chosen image to a light Base64 data URL
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileMsg({ text: "Please choose an image file (PNG, JPG, JPEG, WEBP)", type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 400; // max width/height for avatar
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatarPreview(compressedDataUrl);
        setFormData((prev) => ({ ...prev, avatar: compressedDataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview("");
    setFormData((prev) => ({ ...prev, avatar: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: "", type: "" });
    setSavingProfile(true);

    try {
      await updateProfile(formData);
      setProfileMsg({ text: "Profile and photo updated successfully!", type: "success" });
    } catch (err) {
      setProfileMsg({ text: err.message || "Failed to update profile", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg({ text: "", type: "" });

    if (passwords.newPassword !== passwords.confirmPassword) {
      return setPassMsg({ text: "New passwords do not match", type: "error" });
    }

    if (passwords.newPassword.length < 6) {
      return setPassMsg({ text: "Password must be at least 6 characters", type: "error" });
    }

    setChangingPass(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPassMsg({ text: "Password changed successfully!", type: "success" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPassMsg({ text: err.message || "Failed to update password", type: "error" });
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Email Verification Banner */}
        {user && !user.isVerified && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 text-amber-800 dark:text-amber-300">
            <ShieldAlert size={20} className="shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-semibold">Your email address isn&apos;t verified yet.</p>
              <p className="text-amber-700 dark:text-amber-400/90">
                {verifyMsg || "Verify your email to secure your account and unlock full access."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 disabled:opacity-60 transition"
            >
              {resendingVerification ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>
        )}

        {/* Profile Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
          {/* Avatar with Camera Trigger */}
          <div className="relative group shrink-0">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={formData.name || "Profile"}
                className="h-24 w-24 rounded-3xl object-cover border-2 border-indigo-200 shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600 text-3xl font-extrabold text-white uppercase shadow-md">
                {formData.name ? formData.name[0] : "U"}
              </div>
            )}

            {/* Quick change button overlay */}
           
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{formData.name || user?.name}</h1>
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-0.5 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-mono font-medium">
                ID: {formData.studentId || user?.studentId || "N/A"}
              </span>
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-medium">
                Dept: {formData.department || "General"}
              </span>
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-medium">
                Year: {formData.year || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Personal Information & Avatar Form */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              Profile Details
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Update your profile photo, campus credentials, and personal information
            </p>

            {profileMsg.text && (
              <div
                className={`mt-4 flex items-center gap-2.5 rounded-xl p-3.5 text-sm font-medium border ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 border-rose-200"
                }`}
              >
                {profileMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
              {/* Photo Upload Card Section */}
              <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-900 mb-3">
                  Profile Photo (From Device)
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-16 w-16 rounded-2xl object-cover border border-indigo-300 shadow-xs"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 font-bold text-xl">
                      {formData.name ? formData.name[0] : "U"}
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
                    >
                      <Upload size={14} />
                      Choose Photo from Device
                    </button>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 size={13} />
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                  Supports JPG, PNG, WEBP. Images are automatically optimized for fast campus browsing.
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="mt-1.5 relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    College Email (Readonly)
                  </label>
                  <div className="mt-1.5 relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Student ID / Roll No.
                  </label>
                  <div className="mt-1.5 relative">
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleProfileChange}
                      placeholder="e.g. CC2026-CS-042"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <div className="mt-1.5 relative">
                    <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      placeholder="+91 98765 00000"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Department
                  </label>
                  <div className="mt-1.5 relative">
                    <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Academic Year
                  </label>
                  <div className="mt-1.5 relative">
                    <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      {YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  About Me / Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell campus peers about your interests, projects, or goals..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-3.5 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 transition"
                >
                  <Save size={16} />
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound size={20} className="text-indigo-600" />
              Change Password
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Ensure your account uses a strong password
            </p>

            {passMsg.text && (
              <div
                className={`mt-4 flex items-center gap-2.5 rounded-xl p-3.5 text-sm font-medium border ${
                  passMsg.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 border-rose-200"
                }`}
              >
                {passMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <div className="mt-1.5 relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      required
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <div className="mt-1.5 relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      required
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, newPassword: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Confirm New
                  </label>
                  <div className="mt-1.5 relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      required
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirmPassword: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={changingPass}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 transition"
                >
                  <KeyRound size={16} />
                  {changingPass ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
