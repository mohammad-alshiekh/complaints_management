"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
   
} from "recharts";

import {
  MdBusiness,
  MdPeople,
  MdCheckCircle,
  MdPendingActions,
  MdCancel,
  MdTrendingUp,
} from "react-icons/md";
import apiClient from "../../lib/api";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/button";
import { GovernorateNames } from "@/enums";

// ======================================
// DUMMY DATA (NO EXPORTS HERE)
// ======================================

const stats = [
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

const monthlyData = [
  { month: "Jan", pending: 12, inprogress: 20, completed: 35, canceled: 5 },
  { month: "Feb", pending: 8, inprogress: 18, completed: 32, canceled: 4 },
  { month: "Mar", pending: 15, inprogress: 25, completed: 30, canceled: 6 },
  { month: "Apr", pending: 10, inprogress: 22, completed: 28, canceled: 3 },
  { month: "May", pending: 7, inprogress: 15, completed: 40, canceled: 2 },
  { month: "Jun", pending: 9, inprogress: 18, completed: 38, canceled: 4 },
  { month: "Jul", pending: 6, inprogress: 20, completed: 42, canceled: 5 },
];

 const initialGovernorateData = Object.keys(GovernorateNames).map((k) => ({
  state: GovernorateNames[Number(k) as keyof typeof GovernorateNames],
  value: 0,
}));

const complaintsByOrg = [
  { name: "Resources", value: 12, color: "#FF9500" },
  { name: "Transportation", value: 7, color: "#8B5CF6" },
  { name: "Communication", value: 5, color: "#FF6B6B" },
  { name: "Law", value: 3, color: "#00C49F" },
];

// Agency chart initial
const initialAgencyData: { name: string; value: number; color?: string }[] = [];

// ======================================
// PAGE COMPONENT
// ======================================

export default function DashboardPage() {
  const [complaintsByState, setComplaintsByState] = useState(initialGovernorateData);
  const [isLoading, setIsLoading] = useState(true);
  const [complaintsByAgency, setComplaintsByAgency] = useState(initialAgencyData);
  const [isAgencyLoading, setIsAgencyLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const token = getToken();
        const data = await apiClient.getComplaintsByGovernorate(token);
        // transform to chart format and preserve order of GovernorateNames
        const mapped = Object.keys(GovernorateNames).map((k) => {
          const key = Number(k);
          const found = (data || []).find((d) => Number(d.governorate) === key);
          return { state: GovernorateNames[key as keyof typeof GovernorateNames], value: found ? Math.round(Number(found.count)) : 0 };
        });
        setComplaintsByState(mapped);
        // Fetch agency analytics
        try {
          setIsAgencyLoading(true);
          const agency = await apiClient.getComplaintsByAgency(token);
          const palette = ["#FF9500", "#8B5CF6", "#FF6B6B", "#00C49F", "#F59E0B", "#06B6D4", "#A78BFA"];
          const mappedAgency = (agency || []).map((a, idx) => ({
            name: a.governmentEntityName || a.governmentEntityId,
            value: Math.round(Number(a.count || 0)),
            color: palette[idx % palette.length],
          }));
          setComplaintsByAgency(mappedAgency);
        } catch (e) {
          console.error("Failed to load agency analytics:", e);
          setComplaintsByAgency([]);
        } finally {
          setIsAgencyLoading(false);
        }
      } catch (err) {
        console.error("Failed to load governorate analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time analytics and complaint statistics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">Live Status</span>
          </div>
          <Button className="bg-[#0C3DA7] text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
            <MdTrendingUp />
            Generate Report
          </Button>
        </div>
      </div>

      {/* ======================================
          STAT CARDS
      ======================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1">{s.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================
          CHART GRID
      ======================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Complaints per State */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:col-span-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Complaints per State</h3>
              <p className="text-xs text-gray-500">Distribution across governorates</p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-100">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          
          {isLoading ? (
            <div className="w-full h-80 rounded-2xl bg-gray-50 animate-pulse" />
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={complaintsByState}
                  margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                  barSize={32}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="state"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748B' }} 
                    allowDecimals={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#0C3DA7" radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="value" position="top" style={{ fontSize: '10px', fill: '#64748B', fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Complaints per Agency */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:col-span-4 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Complaints per Agency</h3>
            <p className="text-xs text-gray-500">Categorical breakdown</p>
          </div>
          
          <div className="flex-1 min-h-[300px] relative">
            {isAgencyLoading ? (
              <div className="absolute inset-0 rounded-2xl bg-gray-50 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complaintsByAgency.length ? complaintsByAgency : complaintsByOrg}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {(complaintsByAgency.length ? complaintsByAgency : complaintsByOrg).map((entry, index) => (
                      <Cell key={index} fill={entry.color || "#8884d8"} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Monthly Complaints Status */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:col-span-12 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Monthly Performance Trend</h3>
              <p className="text-xs text-gray-500">Status-wise monthly breakdown</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="w-3 h-3 rounded-full bg-red-500"></span> Pending
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="w-3 h-3 rounded-full bg-green-500"></span> In Progress
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Completed
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="pending" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="inprogress" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
