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
    <div className="min-h-full bg-[#f7fbfa] p-4 md:p-6 lg:p-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase text-gray-500 tracking-wide">
          Preferences
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your basic information, notification preferences, and theme
          options for the dashboard.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              <p className="text-sm text-gray-500">
                This information will be displayed across the platform.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Role", name: "role", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "tel" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={profile[field.name as keyof ProfileSettings]}
                    onChange={handleProfileChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  />
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={profile.timezone}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
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

          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
              <p className="text-sm text-gray-500">
                Pick how you want to stay up to date.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Email alerts",
                  description: "Complaints assigned to you and status updates.",
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
                  description: "Summary of attendance, finance, and events.",
                  name: "weeklyDigest",
                },
              ].map((option) => (
                <div
                  key={option.name}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {option.label}
                    </p>
                    <p className="text-sm text-gray-500">
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
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      notifications[option.name as keyof NotificationSettings]
                        ? "bg-gray-900"
                        : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
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

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme</h2>
            <div className="space-y-3">
              {(["light", "dark", "system"] as Theme[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setTheme(option)}
                  className={`w-full text-left rounded-2xl border px-4 py-3 text-sm capitalize ${
                    theme === option
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option} mode
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Danger zone
              </h2>
              <p className="text-sm text-gray-500">
                Log out everywhere or deactivate the current dashboard session.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/logout"
                className="inline-flex items-center justify-center rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Logout from all devices
              </Link>
              <button className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Deactivate session
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Need help?
            </h2>
            <p className="text-sm text-gray-500">
              Reach out to support for account changes or to migrate your data.
            </p>
            <Link
              href="/list/complaints"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Contact support →
            </Link>
          </section>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500">
          All changes are saved locally. Persist them through your API once
          available.
        </p>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none rounded-xl border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-1 md:flex-none rounded-xl bg-gray-900 text-white px-6 py-2 text-sm font-semibold hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

