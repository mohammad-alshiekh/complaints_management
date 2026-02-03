"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Governorate,
  GovernorateNames,
  ComplaintStatus,
  ComplaintStatusLabels,
} from "@/enums";
import {
  Complaint,
  ComplaintPriority,
  ComplaintApiResponse,
} from "@/models/complaint";
import apiClient from "@/app/lib/api";
import { getToken, getUserRole, getUser } from "@/lib/auth";
import { ROLES } from "@/lib/permissions";
import { ComplaintTableSkeleton } from "./Skeletons";
import { useTable } from "@/hooks/useTable";
import { GeneralPagination } from "./GeneralPagination";
import { 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ExternalLink,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Building2,
  Tag,
  Download,
  FileSpreadsheet
} from "lucide-react";
 import { Card } from "@/components/ui/card";
 import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import toast from "react-hot-toast";

 const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.Pending]: "bg-amber-50 text-amber-700 border-amber-100",
  [ComplaintStatus.InProgress]: "bg-blue-50 text-blue-700 border-blue-100",
  [ComplaintStatus.Completed]: "bg-emerald-50 text-emerald-700 border-emerald-100",
  [ComplaintStatus.Rejected]: "bg-rose-50 text-rose-700 border-rose-100",
};

 
 
 

const PAGE_SIZE = 10;

 const statusFromNumber = (value: number): ComplaintStatus => {
  switch (value) {
    case 0:
      return ComplaintStatus.Pending;
    case 1:
      return ComplaintStatus.InProgress;
    case 2:
      return ComplaintStatus.Completed;
    case 3:
      return ComplaintStatus.Rejected;
    default:
      return ComplaintStatus.Pending;
  }
};

const priorityFromSeverity = (value: number): ComplaintPriority => {
  if (value >= 3) return "Urgent";
  if (value === 2) return "High";
  if (value === 1) return "Medium";
  return "Low";
};

const mapComplaintFromApi = (apiComplaint: ComplaintApiResponse): Complaint => ({
  id: apiComplaint.id,
  title: apiComplaint.title,
  category: apiComplaint.governmentEntityName ?? "General",
  studentName: apiComplaint.citizenName ?? "Unknown",
  studentClass: "",
  studentId: apiComplaint.citizenPhoneNumber ?? "N/A",
  guardianName: apiComplaint.citizenName ?? "Unknown",
  email: apiComplaint.citizenEmail ?? "",
  phone: apiComplaint.citizenPhoneNumber ?? "",
  status: statusFromNumber(apiComplaint.status),
  priority: priorityFromSeverity(apiComplaint.severity),
  severity: apiComplaint.severity,
  // Accept either 'type' (numeric or string) or 'complaintType' from API
  type: (() => {
    const raw = (apiComplaint as any).type ?? apiComplaint.complaintType;
    if (raw === undefined || raw === null) return undefined;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })(),
  // backward-compatible field
  complaintType: (() => {
    const raw = (apiComplaint as any).type ?? apiComplaint.complaintType;
    if (raw === undefined || raw === null) return undefined;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })(),
  referenceNumber: apiComplaint.referenceNumber,
  createdAt: apiComplaint.createdAt,
  updatedAt: apiComplaint.createdAt,
  dueAt: apiComplaint.createdAt,
  governorate: (() => {
    const raw = (apiComplaint as any).governorate;
    if (raw === undefined || raw === null) return undefined;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })(),
  lockedBy: (() => {
    const raw = (apiComplaint as any).lockedBy ?? (apiComplaint as any).locked_by;
    if (raw === undefined || raw === null) return undefined;
    return String(raw);
  })(),
  summary: apiComplaint.title,
  description: apiComplaint.description || apiComplaint.title,
  tags: [],
  attachments: [],
  timeline: [],
});

const formatDate = (value: string) => {
  if (!value) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(value));
  } catch (e) {
    return "N/A";
  }
};



const ComplaintRow = ({ complaint, currentUserId }: { complaint: Complaint; currentUserId?: string }) => {
  const { t, dir } = useLanguage();
  
  const isLocked = complaint.lockedBy && complaint.lockedBy !== "null" && complaint.lockedBy !== "";
  const isLockedByMe = isLocked && complaint.lockedBy === currentUserId;
  const canViewDetails = !isLocked || isLockedByMe;

  const getStatusLabel = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.Pending: return t('pending');
      case ComplaintStatus.InProgress: return t('inProgress');
      case ComplaintStatus.Completed: return t('completed');
      case ComplaintStatus.Rejected: return t('rejected');
      default: return ComplaintStatusLabels[status];
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-sm">
            {complaint.referenceNumber || `#${complaint.id.substring(0, 8).toUpperCase()}`}
          </span>
         </div>
      </td>
      <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div className="flex flex-col max-w-[250px]">
          <span className="font-semibold text-slate-900 line-clamp-1">{complaint.title}</span>
          <div className="flex items-center gap-1.5 mt-1">
             <span className="text-xs text-slate-400 line-clamp-1">{complaint.description}</span>
          </div>
        </div>
      </td>
      <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span className="text-sm text-slate-700">
            {complaint.governorate !== undefined ? GovernorateNames[complaint.governorate as Governorate] : "N/A"}
          </span>
        </div>
      </td>
      <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-3 h-3" />
          <span className="text-[11px]">{formatDate(complaint.createdAt)}</span>
        </div>
      </td>
      <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5   text-xs font-semibold ${STATUS_COLORS[complaint.status]}`}>
          <span className=" py-0.5 rounded-full bg-current" />
          {getStatusLabel(complaint.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        {isLocked ? (
          <div className="flex flex-col items-center gap-1" title={`${t('lock')} by ${complaint.lockedBy}`}>
            <Lock className={`w-4 h-4 ${isLockedByMe ? 'text-blue-500' : 'text-amber-500'}`} />
            <span className={`text-[10px] font-medium truncate max-w-[80px] ${isLockedByMe ? 'text-blue-600' : 'text-amber-600'}`}>
              {isLockedByMe ? t('lockedByMe') || 'By Me' : complaint.lockedBy}
            </span>
          </div>
        ) : (
          <Unlock className="w-4 h-4 text-slate-300 mx-auto" />
        )}
      </td>
      <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100 transition-colors">
              <MoreVertical className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-40 rounded-xl shadow-xl border-slate-100 p-1">
            {canViewDetails && (
              <Link href={`/list/complaints/${complaint.id}`}>
                <DropdownMenuItem className="rounded-lg cursor-pointer flex items-center gap-2 py-2">
                  <ExternalLink className={`w-4 h-4 text-blue-500 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  <span className="font-medium">{t('viewDetails')}</span>
                </DropdownMenuItem>
              </Link>
            )}
            {!canViewDetails && isLocked && (
              <div className="px-3 py-2 text-xs text-slate-400 italic">
                {t('locked') || 'Locked'}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export const ComplaintsList = () => {
  const { t, dir } = useLanguage();
  const user = getUser();
  const currentUserId = user?.userId;
  const userRole = getUserRole();
  const isEmployee = userRole === ROLES.EMPLOYEE;
  
  const [statusFilter, setStatusFilter] = useState<number | "All">("All");
  const [agencyFilter, setAgencyFilter] = useState<string | "All">("All");
  const [agencies, setAgencies] = useState<Array<{ id: string; name: string }>>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const exportPeriods = [
    { label: t('day') || 'Day', value: 0 },
    { label: t('week') || 'Week', value: 1 },
    { label: t('month') || 'Month', value: 2 },
    { label: t('year') || 'Year', value: 3 },
  ];

  const handleExport = async (period: number) => {
    setIsExporting(true);
    try {
      const token = getToken();
      const downloadPath = await apiClient.exportComplaints(token, period);
      
      if (downloadPath) {
        // Construct the full URL using the backend domain
        const backendDomain = "https://complaint.runasp.net";
        const fullUrl = downloadPath.startsWith('http') 
          ? downloadPath 
          : `${backendDomain}${downloadPath.startsWith('/') ? '' : '/'}${downloadPath}`;
        
        console.log("Opening export URL:", fullUrl);
        
        // Open in new tab
        window.open(fullUrl, '_blank');
        toast.success(t('exportSuccess') || 'Export started successfully');
      }
    } catch (error: any) {
      console.error("Export failed", error);
      toast.error(error.message || t('exportFailed') || 'Failed to export complaints');
    } finally {
      setIsExporting(false);
    }
  };

  const STATUS_FILTERS_LOCAL = [
    { label: t('all'), value: "All" },
    { label: t('pending'), value: ComplaintStatus.Pending },
    { label: t('inProgress'), value: ComplaintStatus.InProgress },
    { label: t('completed'), value: ComplaintStatus.Completed },
    { label: t('rejected'), value: ComplaintStatus.Rejected },
  ];

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const token = getToken();
        const result = await apiClient.getAgencies(token);
        setAgencies(result);
      } catch (e) { console.error("Agencies load failed", e); }
    };
    fetchAgencies();
  }, []);

  const fetcher = useCallback(async ({ page, size, search }: { page: number; size: number; search: string }) => {
    const token = getToken();
    const params: any = {
      page,
      size,
    };

    if (agencyFilter !== "All") params.agencyId = agencyFilter;
    if (statusFilter !== "All") params.complaintStatus = statusFilter;
    if (search.trim()) params.searchTerm = search;

    const response = (await apiClient.getComplaints(token, params)) as any;

    const rawItems = response.items || [];
    const total = response.totalCount || 0;
    const totalPages = response.totalPages || Math.ceil(total / size) || 1;

    const mapped = rawItems.map(mapComplaintFromApi);
    
    if (page === 1 && !search && statusFilter === "All" && agencyFilter === "All") {
        setAllComplaints(mapped);
    }

    return {
      data: mapped,
      totalCount: total,
      totalPages: totalPages,
    };
  }, [agencyFilter, statusFilter]);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    paginatedData: complaints,
    totalPages,
    totalItems,
    isLoading,
    itemsPerPage,
  } = useTable<Complaint>({
    fetcher,
    itemsPerPage: PAGE_SIZE,
  });

  const stats = useMemo(() => {
    return {
      total: totalItems,
      pending: allComplaints.filter(c => c.status === ComplaintStatus.Pending).length,
      inProgress: allComplaints.filter(c => c.status === ComplaintStatus.InProgress).length,
      completed: allComplaints.filter(c => c.status === ComplaintStatus.Completed).length
    };
  }, [totalItems, allComplaints]);

  const handleFilterChange = (type: 'status' | 'agency'  , value: any) => {
    if (type === 'status') setStatusFilter(value);
    if (type === 'agency') setAgencyFilter(value);
     setCurrentPage(1);
  };

  return (
    <div className="space-y-8" dir={dir}>
      {/* Stats Cards */}
     
     
      <div className="space-y-6">
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{t('complaintsManagement')}</h3>
           </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input
                type="text"
                placeholder={t('search') || "Search complaints..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all w-[240px] text-sm font-medium placeholder:text-slate-400"
              />
            </div>

            <Select
              value={statusFilter.toString()}
              onValueChange={(value) => handleFilterChange('status', value === "All" ? "All" : Number(value))}
            >
              <SelectTrigger className="w-[160px] h-11 rounded-xl bg-white border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder={t('status')} />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {STATUS_FILTERS_LOCAL.map((f) => (
                  <SelectItem key={f.label} value={f.value.toString()}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {!isEmployee && (
              <Select
                value={agencyFilter}
                onValueChange={(value) => handleFilterChange('agency', value)}
              >
                <SelectTrigger className="w-[200px] h-11 rounded-xl bg-white border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder={t('allAgencies')} />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">{t('allAgencies')}</SelectItem>
                  {agencies.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-11 rounded-xl bg-white border-slate-200 shadow-sm gap-2 px-4 hover:bg-slate-50"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="font-medium text-slate-700">{t('export')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-48 rounded-xl shadow-xl border-slate-100 p-1">
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('exportPeriod') || 'Select Period'}
                </div>
                {exportPeriods.map((period) => (
                  <DropdownMenuItem
                    key={period.value}
                    className="rounded-lg cursor-pointer flex items-center gap-2 py-2"
                    onClick={() => handleExport(period.value)}
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>{period.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white">
          <div className="overflow-x-auto">
            {isLoading ? (
              <ComplaintTableSkeleton />
            ) : (
              <table className="w-full text-sm" dir={dir}>
                <thead className="border-b bg-slate-50/50">
                  <tr>
                    <th className={`px-6 py-4 font-semibold text-slate-700 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('referenceNumber') || 'Reference #'}</th>
                    <th className={`px-6 py-4 font-semibold text-slate-700 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('details')}</th>
                    <th className={`px-6 py-4 font-semibold text-slate-700 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('location')}</th>
                    <th className={`px-6 py-4 font-semibold text-slate-700 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('date')}</th>
                    <th className={`px-6 py-4 font-semibold text-slate-700 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('status')}</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-center">{t('lock')}</th>
                    <th className={`px-6 py-4 font-semibold text-slate-700 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-10 h-10 text-slate-200" />
                          <p className="text-slate-500 font-medium">{t('noComplaintsFound')}</p>
                          <p className="text-xs text-slate-400">{t('adjustFilters')}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    complaints.map((c) => <ComplaintRow key={c.id} complaint={c} currentUserId={currentUserId} />)
                  )}
                </tbody>
              </table>
            )}
          </div>

          {!isLoading && complaints.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
              <GeneralPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                label="complaints"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
