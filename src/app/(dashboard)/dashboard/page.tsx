"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useLanguage } from "@/lib/language-context"
import StatsCard from "@/components/card_users"
import { getToken, getUserRole } from "@/lib/auth"
import apiClient from "@/app/lib/api"
import { GovernorateNames, UserRole } from "@/enums"
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react"
import { ChartSkeleton, PieChartSkeleton } from "@/components/Skeletons"

const initialAgencyData: { name: string; value: number; color?: string }[] = [];

const initialGovernorateData = Object.keys(GovernorateNames).map((k) => ({
  state: GovernorateNames[Number(k) as keyof typeof GovernorateNames],
  value: 0,
}));

export default function AnalyticsPage() {
  const { t, dir } = useLanguage();
  const userRole = getUserRole();
  const isEmployee = userRole === UserRole.User;

  const complaintsByOrg = [
    { name: t('resources'), value: 12, color: "#FF9500" },
    { name: t('transportation'), value: 7, color: "#8B5CF6" },
    { name: t('communication'), value: 5, color: "#FF6B6B" },
    { name: t('law'), value: 3, color: "#00C49F" },
  ];

  const [complaintsByState, setComplaintsByState] = useState(initialGovernorateData);
  const [isLoading, setIsLoading] = useState(true);
  const [complaintsByAgency, setComplaintsByAgency] = useState(initialAgencyData);
  const [isAgencyLoading, setIsAgencyLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState<{ [key: number]: number }>({
    0: 0,
    1: 0,
    2: 0,
    3: 0
  });

  const complaintsByStatusData = [
    { name: t('pending'), value: statusCounts[0] || 0, color: "#f59e0b" },
    { name: t('inProgress'), value: statusCounts[1] || 0, color: "#3b82f6" },
    { name: t('completed'), value: statusCounts[2] || 0, color: "#10b981" },
    { name: t('rejected'), value: statusCounts[3] || 0, color: "#ef4444" },
  ].filter(item => item.value > 0);

  const displayStatusData = complaintsByStatusData.length > 0 
    ? complaintsByStatusData 
    : [
        { name: t('pending'), value: 1, color: "#f3f4f6" }
      ];

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const token = getToken();
        const [govData, agencyData, statusData] = await Promise.all([
          apiClient.getComplaintsByGovernorate(token),
          apiClient.getComplaintsByAgency(token).catch(() => []),
          apiClient.getComplaintStatusCounts(token).catch(() => [])
        ]);

        const mapped = Object.keys(GovernorateNames).map((k) => {
          const key = Number(k);
          const found = (govData || []).find((d) => Number(d.governorate) === key);
          return { state: GovernorateNames[key as keyof typeof GovernorateNames], value: found ? Math.round(Number(found.count)) : 0 };
        });
        setComplaintsByState(mapped);

        const statusMap: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0 };
        (statusData || []).forEach(item => {
          statusMap[item.status] = item.count;
        });
        setStatusCounts(statusMap);

        const palette = ["#FF9500", "#8B5CF6", "#FF6B6B", "#00C49F", "#F59E0B", "#06B6D4", "#A78BFA"];
        const mappedAgency = (agencyData || []).map((a, idx) => ({
          name: a.governmentEntityName || a.governmentEntityId,
          value: Math.round(Number(a.count || 0)),
          color: palette[idx % palette.length],
        }));
        setComplaintsByAgency(mappedAgency);
        setIsAgencyLoading(false);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8" dir={dir}>
      <div className="grid mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label={t('canceled')}
          value={statusCounts[3] || 0}
          icon={FileText}
          iconBg="from-red-500/25 to-red-500/5"
          iconColor="text-red-600"
        />
        <StatsCard
          label={t('pending')}
          value={statusCounts[0] || 0}
          icon={Clock}
          iconBg="from-amber-500/25 to-amber-500/5"
          iconColor="text-amber-600"
        />
        <StatsCard
          label={t('inProgress')}
          value={statusCounts[1] || 0}
          icon={AlertCircle}
          iconBg="from-blue-500/25 to-blue-500/5"
          iconColor="text-blue-600"
        />
        <StatsCard
          label={t('completed')}
          value={statusCounts[2] || 0}
          icon={CheckCircle2}
          iconBg="from-emerald-500/25 to-emerald-500/5"
          iconColor="text-emerald-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <CardTitle>{t('complaints_status')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <PieChartSkeleton />
            ) : (
              <div className="h-80" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={displayStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {displayStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ textAlign: dir === 'rtl' ? 'right' : 'left' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {isEmployee ? (
          <Card className="border-gray-200">
            <CardHeader className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <CardTitle>{t('complaintsPerState')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <div className="h-80 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={complaintsByState}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis
                        dataKey="state"
                        stroke="#6b7280"
                        fontSize={11}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={11}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          textAlign: dir === 'rtl' ? 'right' : 'left'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200">
            <CardHeader className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <CardTitle>{t('complaintsPerAgency')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading || isAgencyLoading ? (
                <ChartSkeleton />
              ) : (
                <div className="h-80" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complaintsByAgency.length ? complaintsByAgency : complaintsByOrg}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          textAlign: dir === 'rtl' ? 'right' : 'left'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#f67d5cff"
                        strokeWidth={3}
                        dot={{ fill: "#e2250cff", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {!isEmployee && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className={`flex items-center justify-between mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <h3 className="text-lg font-bold text-gray-900">{t('complaintsPerState')}</h3>
            </div>
          </div>

          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="h-80 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complaintsByState}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="state"
                    stroke="#6b7280"
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      textAlign: dir === 'rtl' ? 'right' : 'left'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
