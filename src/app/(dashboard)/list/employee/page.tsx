"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Plus, 
  Search, 
  UserPlus, 
  CheckCircle2,
  XCircle,
  Filter,
  ShieldCheck,
  Building,
  Mail,
  Loader2,
  Users as UsersIcon,
  Check,
  ShieldAlert,
  Smartphone,
  MoreVertical,
  Trash2,
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/app/lib/api";
import { getToken } from "@/lib/auth";
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
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/Modal";
import { useTable } from "@/hooks/useTable";
import { GeneralPagination } from "@/components/GeneralPagination";
import StatsCard from "@/components/card_users";
import { Agency } from "@/models";
import { useLanguage } from "@/lib/language-context";

interface Employee {
  id: string;
  fullName: string;
  email: string;
  governmentEntityId: string;
  isActive?: boolean; 
  role?: string;
}

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  className = "",
  showAllOption = false
}: { 
  options: Array<{id: string, name: string}>, 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string,
  className?: string,
  showAllOption?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { t, dir } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.id === value);
  const displayValue = value === "all" ? t('allAgencies') : (selectedOption?.name || placeholder);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-700 hover:border-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-[110] left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
            {showAllOption && (
              <button
                type="button"
                onClick={() => {
                  onChange("all");
                  setIsOpen(false);
                }}
                className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'} px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  value === "all" ? "bg-blue-50 text-blue-600" : "text-blue-600 hover:bg-slate-50"
                }`}
              >
                {t('allAgencies')}
              </button>
            )}
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'} px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  value === option.id ? "bg-slate-100 text-blue-600 font-semibold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAgenciesLoading, setIsAgenciesLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { t, dir } = useLanguage();

  const [modals, setModals] = useState({
    deleteEmployee: false,
    viewEmployee: false,
    addEmployee: false,
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeForm, setEmployeeForm] = useState({
    fullName: "",
    email: "",
    password: "",
    governmentEntityId: "",
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  useEffect(() => {
    fetchEmployees(selectedAgencyId);
  }, [selectedAgencyId]);

  const fetchAgencies = async () => {
    setIsAgenciesLoading(true);
    try {
      const token = getToken();
      const data = await apiClient.getAgencies(token);
      setAgencies(data);
    } catch (error) {
      console.error("Error fetching agencies:", error);
      toast.error(t('failedToLoadAgencies'));
    } finally {
      setIsAgenciesLoading(false);
    }
  };

  const fetchEmployees = async (agencyId: string) => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (agencyId === "all") {
        const data = await apiClient.getAllAgencyUsers(token);
        setEmployees(data);
      } else {
        const data = await apiClient.getAgencyUsers(agencyId, token);
        setEmployees(data);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error(t('failedToLoadEmployees'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      const token = getToken();
      if (!employeeForm.fullName || !employeeForm.email || !employeeForm.password || !employeeForm.governmentEntityId) {
        return toast.error(t('fillRequiredFields'));
      }
      setIsCreating(true);
      await apiClient.createAgencyUser(employeeForm, token);
      toast.success(t('employeeCreated'));
      setModals(m => ({ ...m, addEmployee: false }));
      // Reset form
      setEmployeeForm({
        fullName: "",
        email: "",
        password: "",
        governmentEntityId: selectedAgencyId,
      });
      fetchEmployees(selectedAgencyId);
    } catch (error: any) {
      toast.error(error.message || t('failedToCreateEmployee'));
    } finally {
      setIsCreating(false);
    }
  };

  const toggleEmployeeStatus = async (employee: Employee, activate: boolean) => {
    try {
      const token = getToken();
      if (activate) {
        await apiClient.activateUser(employee.id, token);
        toast.success(t('employeeActivated'));
      } else {
        await apiClient.deactivateUser(employee.id, token);
        toast.success(t('employeeDeactivated'));
      }
      fetchEmployees(selectedAgencyId);
    } catch (error) {
      toast.error(activate ? t('failedToActivate') : t('failedToDeactivate'));
    }
  };

  const stats = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter(e => e.isActive !== false).length, 
      inactive: employees.filter(e => e.isActive === false).length,
      agenciesCount: agencies.length,
    };
  }, [employees, agencies]);

  const filterFn = useCallback((employee: Employee, query: string) => {
    const lowerQuery = query.toLowerCase();
    return (
      employee.fullName.toLowerCase().includes(lowerQuery) ||
      employee.email.toLowerCase().includes(lowerQuery) ||
      employee.id.toLowerCase().includes(lowerQuery)
    );
  }, []);

  const {
    currentPage,
    setCurrentPage,
    paginatedData: paginatedEmployees,
    totalPages,
    totalItems,
    itemsPerPage,
  } = useTable({
    data: employees,
    filterFn,
  });

  const avatarColors = [
    "bg-[#128C7E] text-white", 
    "bg-[#075E54] text-white", 
    "bg-[#34B7F1] text-white", 
    "bg-[#25D366] text-white", 
    "bg-[#DC143C] text-white",
    "bg-[#FF8C00] text-white",
    "bg-[#9932CC] text-white", 
    "bg-[#4169E1] text-white", 
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
          label={t('totalEmployees')}
          value={stats.total}
          icon={UsersIcon}
          iconBg="from-blue-500/25 to-blue-500/5"
          iconColor="text-blue-600"
        />
        <StatsCard
          label={t('activeEmployees')}
          value={stats.active}
          icon={CheckCircle2}
          iconBg="from-emerald-500/25 to-emerald-500/5"
          iconColor="text-emerald-600"
        />
        <StatsCard
          label={t('inAgencies')}
          value={stats.agenciesCount}
          icon={Building}
          iconBg="from-indigo-500/25 to-indigo-500/5"
          iconColor="text-indigo-600"
        />
        <StatsCard
          label={t('inactiveLabel')}
          value={stats.inactive}
          icon={ShieldAlert}
          iconBg="from-amber-500/25 to-amber-500/5"
          iconColor="text-amber-600"
        />
      </div>

      <div className="mt-0">
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-medium whitespace-nowrap">{t('agencyEmployees')}</h3>
            </div>
            
            <div className="flex items-center gap-3">
                 <CustomDropdown 
                   options={agencies} 
                   value={selectedAgencyId} 
                   onChange={setSelectedAgencyId} 
                   placeholder={t('selectAgency')} 
                   className="w-[250px]"
                   showAllOption={true}
                 />
                
               <Button 
                onClick={() => {
                  setEmployeeForm(f => ({ 
                    ...f, 
                    governmentEntityId: selectedAgencyId === "all" ? "" : selectedAgencyId 
                  }));
                  setModals(m => ({ ...m, addEmployee: true }));
                }}
                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <Plus className="w-4 h-4" />
                {t('addEmployee')}
              </Button>
            </div>
          </div>

          <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <thead className="border-b bg-slate-50/50">
                  <tr>
                    <th className={`px-6 py-4 font-medium text-slate-500 uppercase tracking-wider text-[11px]`}>{t('employeeMember')}</th>
                    <th className={`px-6 py-4 font-medium text-slate-500 uppercase tracking-wider text-[11px]`}>{t('agency')}</th>
                    <th className={`px-6 py-4 font-medium text-slate-500 uppercase tracking-wider text-[11px]`}>{t('contact')}</th>
                    <th className={`px-6 py-4 font-medium text-slate-500 uppercase tracking-wider text-[11px]`}>{t('status')}</th>
                    <th className={`px-6 py-4 font-medium text-slate-500 uppercase tracking-wider text-[11px] ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
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
                  ) : paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => {
                      const avatarColor = getAvatarColor(employee.fullName);
                      return (
                        <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${avatarColor}`}>
                                  {getInitials(employee.fullName)}
                                </div>
                                {employee.isActive !== false && (
                                  <div className={`absolute -bottom-0.5 ${dir === 'rtl' ? '-left-0.5' : '-right-0.5'} w-3 h-3 rounded-full border-2 border-white bg-emerald-500`} />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{employee.fullName}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {employee.id.substring(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-slate-600 font-medium">
                              <Building className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-slate-400`} />
                              {agencies.find(a => a.id === employee.governmentEntityId)?.name || t('unknownAgency')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-slate-600">
                              <Mail className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-slate-400`} />
                              {employee.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="secondary"
                              className={`px-3 py-1 rounded-full border-none text-[10px] font-bold uppercase tracking-wider
                              ${employee.isActive !== false
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                                }`}
                            >
                              {employee.isActive !== false ? t('activeLabel') : t('inactiveLabel')}
                            </Badge>
                          </td>
                          <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100">
                                  <MoreVertical className="w-4.5 h-4.5 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align={dir === 'rtl' ? "start" : "end"} className="w-52 p-1 rounded-xl border-slate-200 shadow-xl bg-white"  >
                                <DropdownMenuItem
                                  className="rounded-lg cursor-pointer py-2.5"
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setModals(m => ({ ...m, viewEmployee: true }));
                                  }}
                                >
                                  <UserIcon className={`w-4 h-4 ${dir === 'rtl' ? 'ml-3' : 'mr-3'} text-slate-500`} />
                                  {t('viewDetails')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                {employee.isActive !== false ? (
                                  <DropdownMenuItem
                                    className="text-orange-600 rounded-lg cursor-pointer py-2.5"
                                    onClick={() => toggleEmployeeStatus(employee, false)}
                                  >
                                    <XCircle className={`w-4 h-4 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                                    {t('deactivate')}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-emerald-600 rounded-lg cursor-pointer py-2.5"
                                    onClick={() => toggleEmployeeStatus(employee, true)}
                                  >
                                    <CheckCircle2 className={`w-4 h-4 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                                    {t('activate')}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-red-600 rounded-lg cursor-pointer py-2.5"
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setModals(m => ({ ...m, deleteEmployee: true }));
                                  }}
                                >
                                  <Trash2 className={`w-4 h-4 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                                  {t('deleteEmployee')}
                                </DropdownMenuItem>
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
                            <UsersIcon className="w-8 h-8 text-slate-300" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">{t('noEmployeeFound')}</h3>
                          <p className="text-slate-500 max-w-xs mx-auto mt-1">
                            {t('employeeCriteriaDesc')}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-white">
              <GeneralPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                label={t('employees')}
              />
            </div>
          </Card>
        </section>
      </div>

      {/* Add Employee Modal */}
      {modals.addEmployee && (
        <Modal title={t('addEmployee')} onClose={() => setModals(m => ({ ...m, addEmployee: false }))}>
          <div className="space-y-5 py-4 px-6" dir={dir}>
            <div className="space-y-1.5">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('fullName')}</label>
              <div className="relative">
                <UserIcon className={`absolute ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                <Input 
                  name="fullName"
                  autoComplete="off"
                  placeholder={t('fullName')} 
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm(f => ({ ...f, fullName: e.target.value }))}
                  className={`${dir === 'rtl' ? 'pr-10 text-right' : 'pl-10'} rounded-xl border-slate-200 h-11 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('email')}</label>
              <div className="relative">
                <Mail className={`absolute ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                <Input 
                  name="email"
                  type="email" 
                  autoComplete="off"
                  placeholder="Employee@agency.gov" 
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm(f => ({ ...f, email: e.target.value }))}
                  className={`${dir === 'rtl' ? 'pr-10 text-right' : 'pl-10'} rounded-xl border-slate-200 h-11 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('agency')}</label>
              <CustomDropdown 
                options={agencies} 
                value={employeeForm.governmentEntityId} 
                onChange={(val) => setEmployeeForm(f => ({ ...f, governmentEntityId: val }))} 
                placeholder={t('selectAgency')} 
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('password')}</label>
              <div className="relative">
                <ShieldCheck className={`absolute ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                <Input 
                  name="new-password"
                  type="password" 
                  autoComplete="new-password"
                  placeholder="••••••••" 
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm(f => ({ ...f, password: e.target.value }))}
                  className={`${dir === 'rtl' ? 'pr-10 text-right' : 'pl-10'} rounded-xl border-slate-200 h-11 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
              </div>
            </div>

            <div className={`pt-6 flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Button 
                variant="ghost" 
                onClick={() => setModals(m => ({ ...m, addEmployee: false }))} 
                className="flex-1 rounded-xl h-12 text-slate-600 font-medium hover:bg-slate-50"
              >
                {t('cancel')}
              </Button>
              <Button 
                onClick={handleCreateEmployee} 
                disabled={isCreating}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('creating')}</span>
                  </div>
                ) : (
                  t('create')
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {modals.deleteEmployee && selectedEmployee && (
        <Modal title={t('deleteEmployeeTitle')} onClose={() => setModals(m => ({ ...m, deleteEmployee: false }))}>
          <div className="py-4 space-y-6" dir={dir}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{t('confirmDeletion')}</h3>
              <p className="text-slate-500 mt-2">
                {t('deleteConfirmationDesc').replace('this employee', selectedEmployee.fullName)}
              </p>
            </div>
            <div className={`flex gap-3 pt-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setModals(m => ({ ...m, deleteEmployee: false }))}>
                {t('keepEmployee')}
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11">
                {t('deletePermanently')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Employee Details Modal */}
      {modals.viewEmployee && selectedEmployee && (() => {
        const avatarColor = getAvatarColor(selectedEmployee.fullName);
        return (
          <Modal title={t('employeeDetails')} onClose={() => setModals(m => ({ ...m, viewEmployee: false }))}>
            <div className="py-4 space-y-6" dir={dir}>
              <div className={`flex items-center gap-5 p-4 bg-slate-50 rounded-2xl ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-sm ${avatarColor}`}>
                  {getInitials(selectedEmployee.fullName)}
                </div>
                <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-xl font-bold text-slate-900">{selectedEmployee.fullName}</h3>
                  <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Badge className="bg-blue-50 text-blue-700 border-none text-[10px] font-bold uppercase">{t('employeeMember')}</Badge>
                    <Badge className={`border-none text-[10px] font-bold uppercase ${selectedEmployee.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {selectedEmployee.isActive !== false ? t('activeLabel') : t('inactiveLabel')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('emailAddress')}</p>
                  <p className={`text-slate-900 font-medium flex items-center gap-2 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Mail className="w-4 h-4 text-slate-400" />
                    {selectedEmployee.email}
                  </p>
                </div>
                <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('assignedAgency')}</p>
                  <p className={`text-slate-900 font-medium flex items-center gap-2 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Building className="w-4 h-4 text-slate-400" />
                    {agencies.find(a => a.id === selectedEmployee.governmentEntityId)?.name || t('unknownAgency')}
                  </p>
                </div>
                <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('internalIdentifier')}</p>
                  <p className="text-slate-900 font-mono text-xs bg-slate-50 p-2 rounded-lg">
                    {selectedEmployee.id}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full rounded-xl h-11 bg-slate-900 text-white hover:bg-slate-800"
                  onClick={() => setModals(m => ({ ...m, viewEmployee: false }))}
                >
                  {t('closeDetails')}
                </Button>
              </div>
            </div>
          </Modal>
        );
      })()}
     
    </div>
  );
};

export default EmployeesPage;
