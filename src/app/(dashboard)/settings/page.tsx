"use client";

import Link from "next/link";
import { useState } from "react";

type Theme = "light" | "dark" | "system";

interface ProfileSettings {
  name: string;
  role: string;
  email: string;
  phone: string;
  timezone: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  weeklyDigest: boolean;
}

const SettingsPage = () => {
  const [profile, setProfile] = useState<ProfileSettings>({
    name: "Mohamad Alshiekh",
    role: "Campus Administrator",
    email: "mohamad@example.com",
    phone: "+971 50 123 4567",
    timezone: "Asia/Dubai (GMT+4)",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    weeklyDigest: true,
  });

  const [theme, setTheme] = useState<Theme>("system");

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (name: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = () => {
    console.table(profile);
    console.table(notifications);
    console.log("theme", theme);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account preferences and application settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
              <p className="text-sm text-gray-500">This information will be displayed across the platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Role", name: "role", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "tel" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={profile[field.name as keyof ProfileSettings]}
                    onChange={handleProfileChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#0C3DA7] outline-none transition-all"
                  />
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={profile.timezone}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#0C3DA7] outline-none transition-all cursor-pointer"
                >
                  <option value="Asia/Dubai (GMT+4)">Asia/Dubai (GMT+4)</option>
                  <option value="Europe/London (GMT+0)">
                    Europe/London (GMT+0)
                  </option>
                  <option value="America/New_York (GMT-5)">
                    America/New_York (GMT-5)
                  </option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Notifications
              </h2>
              <p className="text-sm text-gray-500">
                Pick how you want to stay up to date.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Email alerts",
                  description: "Complaints assigned to you and updates.",
                  name: "email",
                },
                {
                  label: "SMS backup",
                  description: "Emergency updates outside office hours.",
                  name: "sms",
                },
                {
                  label: "Push notifications",
                  description: "Instant alerts directly in the dashboard.",
                  name: "push",
                },
                {
                  label: "Weekly digest",
                  description: "Summary of attendance and events.",
                  name: "weeklyDigest",
                },
              ].map((option) => (
                <div
                  key={option.name}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 p-5 hover:border-blue-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleNotificationToggle(
                        option.name as keyof NotificationSettings
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[option.name as keyof NotificationSettings]
                        ? "bg-[#0C3DA7]"
                        : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[option.name as keyof NotificationSettings]
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Theme Preference</h2>
            <div className="grid grid-cols-3 gap-3">
              {(["light", "dark", "system"] as Theme[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setTheme(option)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-semibold capitalize transition-all ${
                    theme === option
                      ? "border-[#0C3DA7] bg-blue-50 text-[#0C3DA7]"
                      : "border-gray-100 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="mb-1">{option}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-red-600">
                Danger Zone
              </h2>
              <p className="text-xs text-gray-500">
                Irreversible actions for your account.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/logout"
                className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
              >
                Logout Everywhere
              </Link>
              <button className="inline-flex items-center justify-center rounded-xl border border-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Deactivate Session
              </button>
            </div>
          </section>

          <section className="bg-[#0C3DA7] rounded-2xl p-6 shadow-lg shadow-blue-100 text-white space-y-4">
            <h2 className="text-lg font-bold">Need assistance?</h2>
            <p className="text-xs text-blue-100 leading-relaxed">
              Our support team is available 24/7 to help you with any account issues or technical difficulties.
            </p>
            <Link
              href="/list/complaints"
              className="inline-flex items-center justify-center w-full rounded-xl bg-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/30 transition-all"
            >
              Contact Support →
            </Link>
          </section>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-200 pt-8 mt-12">
        <p className="text-sm text-gray-500">
          Last saved: {new Date().toLocaleDateString()}
        </p>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none rounded-xl border border-gray-200 px-8 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            className="flex-1 md:flex-none rounded-xl bg-[#0C3DA7] text-white px-8 py-2.5 text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

