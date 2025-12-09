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
    <div className="min-h-screen bg-[#E6ECF5]">

      {/* TOP BAR */}
      <div className="bg-[#0C3DA7] text-white px-8 py-4 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3 text-lg font-bold">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">📘</div>
          SMART CMS
        </div>

        {/* CENTER */}
        <div className="text-sm opacity-80">
          APPLICATION / <span className="font-semibold">DASHBOARD</span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5 text-xl">
          <MdLanguage />
          <FiBell />
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>

      {/* MENU BAR */}
      <div className="bg-[#0C3DA7] text-white px-8 py-3 flex gap-10 text-sm">
        <div className="flex items-center gap-2 cursor-pointer"><FiHome /> Dashboard</div>
        <div className="flex items-center gap-2 cursor-pointer"><FiDatabase /> Complaints</div>
        <div className="flex items-center gap-2 cursor-pointer"><FiUser /> Users</div>
        <div className="flex items-center gap-2 cursor-pointer"><BiStore /> Store</div>
        <div className="flex items-center gap-2 cursor-pointer"><BsBoxes /> Stock</div>
        <div className="flex items-center gap-2 cursor-pointer"><FiMail /> Inbox</div>
        <div className="flex items-center gap-2 cursor-pointer"><FiBarChart2 /> Reporting</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-8">
        <div className="bg-white p-8 rounded-2xl shadow-md">

          <h2 className="text-2xl font-semibold mb-6">Complaints Statistics</h2>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white shadow rounded-xl p-6 text-center border"
              >
                <div className="text-3xl">{s.icon}</div>
                <div className="text-3xl font-bold mt-2">{s.value}</div>
                <div className="text-gray-500 mt-1">{s.title}</div>
              </div>
            ))}

            {/* GAUGE (STATIC IMAGE STYLE) */}
            <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">
              <img src="/gauge.png" alt="gauge" className="w-28" />
              <p className="mt-2 text-gray-500 text-sm">Risk Meter</p>
            </div>
          </div>

          {/* CHART ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* BAR CHART */}
            <div className="bg-white p-6 shadow rounded-xl lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Monthly Complaints Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar dataKey="pending" fill="#FF3333" />
                  <Bar dataKey="inprogress" fill="#66BB6A" />
                  <Bar dataKey="completed" fill="#42A5F5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PIE CHART + STATS */}
            <div className="bg-white p-6 shadow rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Category Wise Complaints Ratio</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
