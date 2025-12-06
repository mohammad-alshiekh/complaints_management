"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const mockUser = {
  name: "Mohamad Alshiekh",
  title: "Campus Administrator",
  email: "mohamad@example.com",
  phone: "+971 50 123 4567",
  department: "Student Affairs",
  location: "Abu Dhabi, UAE",
  avatar: "/avatar.png",
};

const quickStats = [
  { label: "Complaints Closed", value: "128", trend: "+12% vs last month" },
  { label: "Pending Requests", value: "6", trend: "2 need follow-up" },
  { label: "Students Assigned", value: "354", trend: "Across 4 branches" },
];

const highlights = [
  {
    title: "Next Check-in",
    description: "Weekly parents sync with branch heads.",
    date: "18 Nov 2025",
  },
  {
    title: "Focus Area",
    description: "Reduce complaint turnaround below 24h.",
    date: "Q4 Priority",
  },
];

const recentActivity = [
  {
    id: 1,
    title: "Updated complaint #9823 status to Done",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    title: "Shared attendance summary with Year 3 teachers",
    timestamp: "Yesterday • 6:45 PM",
  },
  {
    id: 3,
    title: "Published notice about winter examinations",
    timestamp: "12 Nov 2025 • 10:20 AM",
  },
];

const ProfilePage = () => {
  const initials = useMemo(
    () =>
      mockUser.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    []
  );

  return (
    <div className="min-h-full bg-[#f7fbfa] p-4 md:p-6 lg:p-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase text-gray-500 tracking-wide">
          Account
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">
          Personal overview, contact information, key metrics, and recent
          activity.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20">
                <Image
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  fill
                  className="object-cover rounded-2xl"
                />
                <div className="absolute inset-0 rounded-2xl border border-white/60 shadow-inner" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {mockUser.name}
                </h2>
                <p className="text-sm text-gray-500">{mockUser.title}</p>
                <div className="mt-2 inline-flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Available for contact
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/settings"
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Edit Profile
              </Link>
              <Link
                href="/logout"
                className="px-4 py-2 rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 transition"
              >
                Logout
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-xs uppercase text-gray-400 tracking-wide">
                Contact
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="font-medium text-gray-900">{mockUser.email}</p>
                <p className="text-gray-600">{mockUser.phone}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-xs uppercase text-gray-400 tracking-wide">
                Work
              </p>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-900">Department:</span>{" "}
                  {mockUser.department}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Location:</span>{" "}
                  {mockUser.location}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-xs uppercase text-gray-400 tracking-wide">
              Highlights
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Quick Stats</p>
              <span className="text-xs text-gray-400">Updated just now</span>
            </div>
            <div className="space-y-4">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              Team Signal
            </p>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-semibold">
                {initials}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Deliverables look on track this week.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  4 projects actively monitored
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Recent Activity
            </p>
            <p className="text-xs text-gray-500">
              Automatic log of your latest actions.
            </p>
          </div>
          <Link
            href="/list/complaints"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Details
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-gray-100 rounded-2xl p-4"
            >
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;

