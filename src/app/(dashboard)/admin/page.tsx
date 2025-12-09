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
  LineChart,
  Line,
} from "recharts";
import { MdBusiness, MdPeople } from "react-icons/md";
import {
  MdCheckCircle,
  MdPendingActions,
  MdCancel,
  MdTrendingUp,
} from "react-icons/md";

// ==========================
// DUMMY DATA
// ==========================

export const stats = [
  {
    title: "Completed",
    value: 1425,
    icon: <MdCheckCircle className="text-green-600 text-3xl" />,
  },
  {
    title: "Pending",
    value: 87,
    icon: <MdPendingActions className="text-yellow-600 text-3xl" />,
  },
  {
    title: "In Progress",
    value: 51,
    icon: <MdTrendingUp className="text-blue-600 text-3xl" />,
  },
  {
    title: "Canceled",
    value: 391,
    icon: <MdCancel className="text-red-600 text-3xl" />,
  },
  {
    title: "Users",
    value: 391,
    icon: <MdPeople className="text-blue-600 text-3xl" />,
  },
  {
    title: "Organizations",
    value: 42,
    icon: <MdBusiness className="text-green-600 text-3xl" />,
  },
];

// Dummy monthly complaint status data including Canceled
const monthlyData = [
  { month: "Jan", pending: 12, inprogress: 20, completed: 35, canceled: 5 },
  { month: "Feb", pending: 8, inprogress: 18, completed: 32, canceled: 4 },
  { month: "Mar", pending: 15, inprogress: 25, completed: 30, canceled: 6 },
  { month: "Apr", pending: 10, inprogress: 22, completed: 28, canceled: 3 },
  { month: "May", pending: 7, inprogress: 15, completed: 40, canceled: 2 },
  { month: "Jun", pending: 9, inprogress: 18, completed: 38, canceled: 4 },
  { month: "Jul", pending: 6, inprogress: 20, completed: 42, canceled: 5 },
  { month: "Jul", pending: 6, inprogress: 20, completed: 42, canceled: 5 } 

];

const complaintsByState = [
  { state: "Damascus", value: 120 },
  { state: "Aleppo", value: 95 },
  { state: "Homs", value: 60 },
  { state: "Latakia", value: 40 },
  { state: "Hama", value: 70 },
  { state: "Raqqa", value: 25 },
  { state: "Deir ez-Zor", value: 15 },
];

const complaintsByOrg = [
  { name: "Resources", value: 12, color: "#FF9500" },
  { name: "Transportation", value: 7, color: "#8B5CF6" },
  { name: "Communication", value: 5, color: "#FF6B6B" },
  { name: "law", value: 3, color: "#00C49F" },
];


// ==========================
// PAGE
// ==========================

export default function DashboardPage() {
  return (
    <div className="min-h-screen  p-5 bg-white ">
 
        {/* =======================
            STAT CARDS
        ======================== */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 mb-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-xl p-6 border flex flex-col items-center justify-center gap-3"
            >
              <div className="text-4xl">{s.icon}</div>
              <div className="text-3xl font-semibold text-gray-900">
                {s.value}
              </div>
              <div className="text-gray-500 text-sm font-medium">
                {s.title}
              </div>
            </div>
          ))}
        </div>

        {/* =======================
            CHART ROW
        ======================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Monthly Trend Chart */}
 

 <div className="bg-white border border-gray-200 rounded-lg p-6">
  <h3 className="text-lg font-semibold mb-4">Complaints per State</h3>
  <ResponsiveContainer width="100%" height={260}>
    <LineChart data={complaintsByState}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="state" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#3B82F6"
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

          {/* Pie Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
  <h3 className="text-lg font-semibold mb-4">Complaints per Type</h3>
  <ResponsiveContainer width="100%" height={260}>
    <PieChart>
      <Pie
        data={complaintsByOrg}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={2}
        dataKey="value"
        nameKey="name"
      >
        {complaintsByOrg.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        verticalAlign="bottom"
        align="center"
        iconType="circle" // makes a dot
        formatter={(value) => `${value}`}
      />
    </PieChart>
  </ResponsiveContainer>
</div>


<div className="bg-white p-6 shadow rounded-xl lg:col-span-2">
  <h3 className="text-lg font-semibold mb-4">Monthly Complaints Status</h3>
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={monthlyData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="pending" fill="#FF3333" />
      <Bar dataKey="inprogress" fill="#66BB6A" />
      <Bar dataKey="completed" fill="#42A5F5" />
      <Bar dataKey="canceled" fill="#9CA3AF" /> {/* Gray color for canceled */}
    </BarChart>
  </ResponsiveContainer>
</div>


        </div>
      </div>
   );
}
