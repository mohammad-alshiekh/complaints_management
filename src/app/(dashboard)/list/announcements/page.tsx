"use client";

import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiBell, FiHome, FiUser, FiDatabase, FiMail, FiBarChart2 } from "react-icons/fi";
import { BiStore } from "react-icons/bi";
import { BsBoxes } from "react-icons/bs";
import { MdLanguage } from "react-icons/md";

// ==========================
// DUMMY DATA
// ==========================

const stats = [
  {
    title: "Total",
    value: 71425,
    icon: "📦",
    color: "text-blue-600",
  },
  {
    title: "Un-Assigned",
    value: 23,
    icon: "📊",
    color: "text-red-600",
  },
  {
    title: "In-Progress",
    value: 51,
    icon: "▶️",
    color: "text-green-600",
  },
  {
    title: "Completed",
    value: 70391,
    icon: "✔️",
    color: "text-blue-800",
  },
];

const monthlyData = [
  { month: "Jan", pending: 900, inprogress: 1200, completed: 3500 },
  { month: "Feb", pending: 800, inprogress: 1100, completed: 3200 },
  { month: "Mar", pending: 1000, inprogress: 1300, completed: 3700 },
  { month: "Apr", pending: 700, inprogress: 1000, completed: 3000 },
];

const pieData = [
  { name: "Category A", value: 30.8 },
  { name: "Category B", value: 50.4 },
  { name: "Category C", value: 18.7 },
];

const pieColors = ["#1E88E5", "#00C49F", "#FFB300"];


// ==========================
// PAGE
// ==========================

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Announcements & Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Detailed statistics and system communications.</p>
        </div>
        <button className="bg-[#0C3DA7] text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
          New Announcement
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Complaints Statistics</h2>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-blue-200 transition-all"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
              <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">{s.title}</div>
            </div>
          ))}

          {/* GAUGE (STATIC IMAGE STYLE) */}
          <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center border border-gray-100">
            <img src="/gauge.png" alt="gauge" className="w-20" />
            <p className="mt-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">Risk Meter</p>
          </div>
        </div>

        {/* CHART ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BAR CHART */}
          <div className="bg-white p-6 border border-gray-100 rounded-2xl lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Complaints Status</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="pending" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="inprogress" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART + STATS */}
          <div className="bg-white p-6 border border-gray-100 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Category Ratio</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
