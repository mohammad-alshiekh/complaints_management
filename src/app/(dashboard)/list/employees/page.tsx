"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  X, 
  Building2, 
  Search, 
  UserPlus, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Filter,
  ArrowUpDown,
  User,
  ShieldCheck,
  Building,
  Mail,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/app/lib/api";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
 import { TableSkeleton, AgencySkeleton } from "@/components/Skeletons";
import { Modal } from "@/components/Modal";

// --- Types ---

interface Employee {
  id: string;
  fullName: string;
  email: string;
  governmentEntityId: string;
  status?: "Active" | "Suspended";
}

interface Agency {
  id: string;
  name: string;
}

// --- Main Page Component ---

const EmployeesPage = () => {
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals State
  const [modals, setModals] = useState({
    addEmployee: false,
    deleteEmployee: false,
    addAgency: false,
    editAgency: false,
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  // Forms State
  const [employeeForm, setEmployeeForm] = useState({
    fullName: "",
    email: "",
    password: "",
    governmentEntityId: "",
  });

  const [agencyForm, setAgencyForm] = useState({
    name: "",
  });

  // --- Effects ---

  useEffect(() => {
    fetchAgencies();
  }, []);

  useEffect(() => {
    if (selectedAgencyId) {
      fetchEmployees();
    } else {
      setEmployees([]);
    }
  }, [selectedAgencyId]);

  // --- API Actions ---

  const fetchAgencies = async () => {
    try {
      const token = getToken();
      if (!token) return toast.error("Authentication required");
      
      const data = await apiClient.getAgencies(token);
      setAgencies(data);
      if (data.length > 0 && !selectedAgencyId) {
        setSelectedAgencyId(data[0].id);
      }
    } catch (error: any) {
      console.error("Fetch Agencies Error:", error);
      // Fallback
      const FALLBACK_ID = "159a6f1f-31de-4eef-8f26-0d47a7cb8b78";
      setSelectedAgencyId(FALLBACK_ID);
      await fetchEmployees(FALLBACK_ID);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (agencyIdParam?: string) => {
    const agencyId = agencyIdParam ?? selectedAgencyId;
    if (!agencyId) return;
    
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;
      
      const data = await apiClient.getAgencyUsers(agencyId, token);
      setEmployees(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      const token = getToken();
      if (!token) return;
      
      if (!employeeForm.fullName || !employeeForm.email || !employeeForm.password) {
        return toast.error("Please fill in all required fields");
      }

      await apiClient.createAgencyUser(employeeForm, token);
      toast.success("Employee created successfully");
      setModals(prev => ({ ...prev, addEmployee: false }));
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.message || "Creation failed");
    }
  };

  const toggleEmployeeStatus = async (employee: Employee, activate: boolean) => {
    try {
      const token = getToken();
      if (!token) return;
      
      if (activate) {
        await apiClient.activateUser(employee.id, token);
        toast.success("Employee activated");
      } else {
        await apiClient.deactivateUser(employee.id, token);
        toast.success("Employee deactivated");
      }
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.message || "Status update failed");
    }
  };

  const handleCreateAgency = async () => {
    try {
      const token = getToken();
      if (!token || !agencyForm.name) return toast.error("Name is required");
      
      await apiClient.createAgency(agencyForm, token);
      toast.success("Agency created");
      setModals(prev => ({ ...prev, addAgency: false }));
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.message || "Agency creation failed");
    }
  };

  const handleUpdateAgency = async () => {
    try {
      const token = getToken();
      if (!token || !selectedAgency || !agencyForm.name) return;
      
      await apiClient.updateAgency(selectedAgency.id, agencyForm, token);
      toast.success("Agency updated");
      setModals(prev => ({ ...prev, editAgency: false }));
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  const handleDeleteAgency = async (agency: Agency) => {
    if (!confirm(`Permanently delete ${agency.name}?`)) return;
    
    try {
      const token = getToken();
      if (!token) return;
      
      await apiClient.deleteAgency(agency.id, token);
      toast.success("Agency deleted");
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.message || "Deletion failed");
    }
  };

  // --- Memoized Data ---

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => 
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // --- Render ---

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B] tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#0C3DA7] w-8 h-8" />
            Employees Management
          </h1>
          <p className="text-[#64748B] text-base mt-2 max-w-2xl">
            A comprehensive overview of all government agencies and their assigned staff members. 
            Manage access, update information, and monitor account status.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Button 
            variant="outline"
            onClick={() => {
              setAgencyForm({ name: "" });
              setModals(m => ({ ...m, addAgency: true }));
            }}
            className="flex-1 md:flex-none h-11 px-6 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-[#0C3DA7] transition-all"
          >
            <Building2 className="w-4 h-4 mr-2" />
            New Agency
          </Button>
          <Button 
            onClick={() => {
              if (!selectedAgencyId) return toast.error("Select an agency first");
              setEmployeeForm({ fullName: "", email: "", password: "", governmentEntityId: selectedAgencyId });
              setModals(m => ({ ...m, addEmployee: true }));
            }}
            className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-[#0C3DA7] text-white hover:bg-[#0A348E] shadow-lg shadow-blue-100 transition-all"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar: Agencies */}
        <aside className="lg:col-span-3 lg:sticky lg:top-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/30">
              <h3 className="font-bold text-[#1E293B] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#0C3DA7]" />
                  Agencies
                </span>
                <span className="text-xs bg-blue-50 text-[#0C3DA7] px-2 py-1 rounded-md font-semibold">
                  {agencies.length}
                </span>
              </h3>
            </div>
            <div className="p-3 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar">
              {loading ? <AgencySkeleton /> : agencies.map((agency) => (
                <div
                  key={agency.id}
                  onClick={() => {
                    setSelectedAgencyId(agency.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all mb-1.5",
                    selectedAgencyId === agency.id
                      ? "bg-[#0C3DA7] text-white shadow-md shadow-blue-100"
                      : "hover:bg-gray-50 text-[#475569] hover:text-[#0C3DA7]"
                  )}
                >
                  <span className="text-sm font-semibold truncate pr-2">{agency.name}</span>
                  <div className={cn(
                    "flex items-center gap-1 transition-all duration-200",
                    selectedAgencyId === agency.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgency(agency);
                        setAgencyForm({ name: agency.name });
                        setModals(m => ({ ...m, editAgency: true }));
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        selectedAgencyId === agency.id ? "hover:bg-white/20 text-white" : "hover:bg-blue-50 text-gray-400 hover:text-blue-600"
                      )}
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAgency(agency);
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        selectedAgencyId === agency.id ? "hover:bg-white/20 text-white" : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                      )}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content: Employees Table */}
        <main className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
            {/* Table Controls */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
              <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C3DA7] transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C3DA7]/10 focus:border-[#0C3DA7] transition-all text-sm font-medium"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-500 text-sm font-medium border border-gray-100">
                  <Filter size={14} />
                  <span>Showing {paginatedEmployees.length} Employees</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-left">
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Staff Member</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Email Address</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Account Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-6">
                        <TableSkeleton />
                      </td>
                    </tr>
                  ) : paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => (
                      <tr key={employee.id} className="group hover:bg-gray-50/80 transition-all duration-150">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-sm border-2 border-white",
                              employee.status === "Suspended" ? "bg-red-50 text-red-600" : "bg-blue-50 text-[#0C3DA7]"
                            )}>
                              {employee.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#1E293B] text-[15px]">{employee.fullName}</span>
                              <span className="text-[12px] text-gray-400 font-medium flex items-center gap-1">
                                <Building size={12} />
                                Staff Member
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <Mail size={14} className="text-gray-400" />
                            {employee.email}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                            employee.status === "Suspended" 
                              ? "bg-red-50 text-red-600" 
                              : "bg-green-50 text-green-600"
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              employee.status === "Suspended" ? "bg-red-500 animate-pulse" : "bg-green-500"
                            )}></span>
                            {employee.status || "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => toggleEmployeeStatus(employee, true)}
                              className="text-green-600 hover:bg-green-50 hover:text-green-700 rounded-lg"
                              title="Activate Account"
                            >
                              <CheckCircle2 size={18} />
                            </Button>
                            <Button 
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => toggleEmployeeStatus(employee, false)}
                              className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 rounded-lg"
                              title="Deactivate Account"
                            >
                              <XCircle size={18} />
                            </Button>
                            <Button 
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setModals(m => ({ ...m, deleteEmployee: true }));
                              }}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                              title="Delete Permanently"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                            <User size={40} className="text-gray-300" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-[#1E293B]">No employees found</h4>
                            <p className="text-gray-400 text-sm font-medium">There are no employees currently assigned to this agency.</p>
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => setModals(m => ({ ...m, addEmployee: true }))}
                            className="mt-2 rounded-xl border-[#0C3DA7] text-[#0C3DA7] hover:bg-blue-50"
                          >
                            <UserPlus size={16} className="mr-2" />
                            Add First Employee
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50/20">
                <p className="text-sm font-semibold text-gray-500">
                  Showing <span className="text-[#0C3DA7]">{paginatedEmployees.length}</span> of <span className="text-[#0C3DA7]">{filteredEmployees.length}</span> total employees
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => c - 1)}
                    className="h-9 px-4 rounded-lg bg-white border-gray-200 font-bold hover:text-[#0C3DA7] transition-all"
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => c + 1)}
                    className="h-9 px-4 rounded-lg bg-white border-gray-200 font-bold hover:text-[#0C3DA7] transition-all"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- Modals --- */}

      {/* Add Employee Modal */}
      {modals.addEmployee && (
        <Modal title="Add New Employee" onClose={() => setModals(m => ({ ...m, addEmployee: false }))}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-[#0C3DA7]" />
                Full Name
              </label>
              <input 
                type="text" 
                placeholder="Enter full name"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0C3DA7]/5 focus:border-[#0C3DA7] outline-none transition-all font-medium text-sm"
                value={employeeForm.fullName}
                onChange={e => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} className="text-[#0C3DA7]" />
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="email@government.gov"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0C3DA7]/5 focus:border-[#0C3DA7] outline-none transition-all font-medium text-sm"
                value={employeeForm.email}
                onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#0C3DA7]" />
                Secure Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0C3DA7]/5 focus:border-[#0C3DA7] outline-none transition-all font-medium text-sm"
                value={employeeForm.password}
                onChange={e => setEmployeeForm({ ...employeeForm, password: e.target.value })}
              />
            </div>
            <div className="pt-2">
              <Button 
                onClick={handleCreateEmployee}
                className="w-full py-6 bg-[#0C3DA7] text-white rounded-xl font-bold hover:bg-[#0A348E] transition-all shadow-lg shadow-blue-100"
              >
                Create Employee Account
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Agency Modal */}
      {modals.addAgency && (
        <Modal title="Create New Agency" onClose={() => setModals(m => ({ ...m, addAgency: false }))}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Building size={14} className="text-[#0C3DA7]" />
                Agency Name
              </label>
              <input 
                type="text" 
                placeholder="e.g. Ministry of Interior"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0C3DA7]/5 focus:border-[#0C3DA7] outline-none transition-all font-medium text-sm"
                value={agencyForm.name}
                onChange={e => setAgencyForm({ name: e.target.value })}
              />
            </div>
            <Button 
              onClick={handleCreateAgency}
              className="w-full py-6 bg-[#0C3DA7] text-white rounded-xl font-bold hover:bg-[#0A348E] transition-all shadow-lg shadow-blue-100"
            >
              Register Agency
            </Button>
          </div>
        </Modal>
      )}

      {/* Edit Agency Modal */}
      {modals.editAgency && (
        <Modal title="Edit Agency Information" onClose={() => setModals(m => ({ ...m, editAgency: false }))}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Building size={14} className="text-[#0C3DA7]" />
                Agency Name
              </label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0C3DA7]/5 focus:border-[#0C3DA7] outline-none transition-all font-medium text-sm"
                value={agencyForm.name}
                onChange={e => setAgencyForm({ name: e.target.value })}
              />
            </div>
            <Button 
              onClick={handleUpdateAgency}
              className="w-full py-6 bg-[#0C3DA7] text-white rounded-xl font-bold hover:bg-[#0A348E] transition-all shadow-lg shadow-blue-100"
            >
              Update Information
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {modals.deleteEmployee && (
        <Modal title="Confirm Permanent Deletion" onClose={() => setModals(m => ({ ...m, deleteEmployee: false }))}>
          <div className="text-center space-y-6 py-2">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-red-100">
              <Trash2 size={36} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-[#1E293B] text-xl tracking-tight">Are you absolutely sure?</h4>
              <p className="text-[#64748B] text-sm font-medium leading-relaxed">
                You are about to permanently remove <span className="text-red-600 font-bold">{selectedEmployee?.fullName}</span>. 
                This action will revoke all access immediately and cannot be reversed.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline"
                onClick={() => setModals(m => ({ ...m, deleteEmployee: false }))}
                className="flex-1 py-6 rounded-xl border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                Keep Employee
              </Button>
              <Button 
                onClick={async () => {
                  if (selectedEmployee) {
                    await toggleEmployeeStatus(selectedEmployee, false);
                    setModals(m => ({ ...m, deleteEmployee: false }));
                  }
                }}
                className="flex-1 py-6 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeesPage;