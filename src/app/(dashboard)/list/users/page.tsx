"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  User as UserIcon,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  UserPlus,
  Users as UsersIcon,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Check,
  X,
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import apiClient from "@/app/lib/api";
import { getToken } from "@/lib/auth";
import { User } from "@/models";
import { Modal } from "@/components/Modal";
import { GeneralPagination } from "@/components/GeneralPagination";
import StatsCard from "@/components/card_users";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useLanguage } from "@/lib/language-context";

const CitizensPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, dir } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const itemsPerPage = 15;

  // Handle debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [modals, setModals] = useState({
    deleteUser: false,
    viewUser: false,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await apiClient.getAllUsers(token, {
        page: currentPage,
        size: itemsPerPage,
        searchQuery: debouncedSearchQuery || undefined
      });
      
      // The API now returns { data: User[], count: number }
      // apiClient.request unwraps the { success, message, data } from our proxy
      setUsers(response.data || []);
      setTotalItems(response.count || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const toggleUserStatus = async (user: User, activate: boolean) => {
    try {
      const token = getToken();
      if (activate) {
        await apiClient.activateUser(user.id, token);
        toast.success(t('citizenActivated'));
      } else {
        await apiClient.deactivateUser(user.id, token);
        toast.success(t('citizenDeactivated'));
      }
      fetchUsers();
    } catch (error) {
      toast.error(activate ? t('failedToActivateCitizen') : t('failedToDeactivateCitizen'));
    }
  };

  const stats = useMemo(() => {
    // Note: These stats are only for the current page since we are using server-side pagination.
    // If the API provides total stats, they should be used instead.
    const citizens = users.filter(u => u.role === "Citizen");
    return {
      total: totalItems, // Use totalItems from API
      active: citizens.filter(u => u.isActive).length,
      verified: citizens.filter(u => u.isVerified).length,
      unverified: citizens.filter(u => !u.isVerified).length,
    };
  }, [users, totalItems]);

  const avatarColors = [
    "bg-[#128C7E] text-white", // Teal
    "bg-[#075E54] text-white", // Dark Teal
    "bg-[#34B7F1] text-white", // Light Blue
    "bg-[#25D366] text-white", // Green
    "bg-[#DC143C] text-white", // Crimson
    "bg-[#FF8C00] text-white", // Dark Orange
    "bg-[#9932CC] text-white", // Dark Orchid
    "bg-[#4169E1] text-white", // Royal Blue
  ];

  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-2 space-y-8 min-h-screen" dir={dir}>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          label={t('totalCitizens')}
          value={stats.total}
          icon={UsersIcon}
          iconBg="from-blue-500/25 to-blue-500/5"
          iconColor="text-blue-600"
        />

        <StatsCard
          label={t('activeCitizens')}
          value={stats.active}
          icon={Check}
          iconBg="from-emerald-500/25 to-emerald-500/5"
          iconColor="text-emerald-600"
        />

        <StatsCard
          label={t('verified')}
          value={stats.verified}
          icon={ShieldCheck}
          iconBg="from-indigo-500/25 to-indigo-500/5"
          iconColor="text-indigo-600"
        />

        <StatsCard
          label={t('unverified')}
          value={stats.unverified}
          icon={ShieldAlert}
          iconBg="from-amber-500/25 to-amber-500/5"
          iconColor="text-amber-600"
        />

      </div>
      <div className="mt-0">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">{t('registeredCitizens')}</h3>
            <div className="flex items-center gap-2">
              <div className="relative w-full lg:w-80">
                <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4`} />
                <Input
                  placeholder={t('searchNameOrId')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className={`${dir === 'rtl' ? 'pr-10' : 'pl-10'} h-11 bg-slate-50/50  border-slate-100 focus:border-slate-200  focus:bg-white transition-all rounded-xl`}
                />
              </div>
            </div>
          </div>
          <Card className="rounded-2xl border-md bg-muted/20 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
             <table className={`w-full text-sm ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <thead className="border-b bg-muted/50">
                  <tr >
                    <th className="px-6 py-4 font-medium">{t('citizenProfile')}</th>
                    <th className="px-6 py-4 font-medium">{t('verification')}</th>
                    <th className="px-6 py-4 font-medium">{t('contact')}</th>
                    <th className="px-6 py-4 font-medium">{t('status')}</th>
                    <th className={`px-6 py-4 font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 py-4">
                          <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-slate-100" />
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-slate-100 rounded w-1/4" />
                              <div className="h-3 bg-slate-50 rounded w-1/3" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : users.length > 0 ? (
                    users.map((user) => {
                      const avatarColor = getAvatarColor(user.fullName);
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${avatarColor}`}>
                                  {getInitials(user.fullName)}
                                </div>
                                {user.isActive !== false && (
                                  <div className={`absolute -bottom-0.5 ${dir === 'rtl' ? '-left-0.5' : '-right-0.5'} w-3 h-3 rounded-full border-2 border-white bg-emerald-500`} />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{user.fullName}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {user.id.substring(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {user.isVerified ? (
                                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                  <ShieldCheck className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'ml-1.5' : 'mr-1.5'}`} /> {t('verifiedLabel')}
                                </span>
                              ) : (
                                <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                  <ShieldAlert className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'ml-1.5' : 'mr-1.5'}`} /> {t('pendingLabel')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-slate-600">
                                <Mail className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-slate-400`} />
                                {user.email}
                              </div>
                              <div className="flex items-center text-sm text-slate-600">
                                <Smartphone className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-slate-400`} />
                                {user.phoneNumber || t('noPhone')}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="secondary"
                              className={`px-3 py-1 rounded-full border-none text-[10px] font-bold uppercase tracking-wider
                              ${user.isActive !== false
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                                }`}
                            >
                              {user.isActive !== false ? t('activeLabel') : t('inactiveLabel')}
                            </Badge>
                          </td>
                          <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100">
                                  <MoreVertical className="w-4.5 h-4.5 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align={dir === 'rtl' ? "start" : "end"} className="w-52 p-1 rounded-xl border-slate-200 shadow-xl"  >
                             
                                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                {user.isActive !== false ? (
                                  <DropdownMenuItem
                                    className="text-orange-600 rounded-lg cursor-pointer py-2.5"
                                    onClick={() => toggleUserStatus(user, false)}
                                  >
                                    <XCircle className={`w-4 h-4 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                                    {t('deactivate')}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-emerald-600 rounded-lg cursor-pointer py-2.5"
                                    onClick={() => toggleUserStatus(user, true)}
                                  >
                                    <CheckCircle2 className={`w-4 h-4 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                                    {t('activate')}
                                  </DropdownMenuItem>
                                )}
                                
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">{t('noCitizensFound')}</h3>
                          <p className="text-slate-500 max-w-xs mx-auto mt-1">
                            {t('citizensCriteriaDesc')}
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => { setSearchQuery(""); }}
                            className="mt-6 rounded-xl border-slate-200"
                          >
                            {t('clearSearch')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100">
              <GeneralPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                label={t('citizens')}
              />
            </div>
          </Card>
        </section>
      </div>
     
    </div>
  );
};

export default CitizensPage;

