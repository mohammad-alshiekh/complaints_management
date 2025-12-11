"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, X, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/app/lib/api";
import { getToken } from "@/lib/auth";

// User Interface
interface User {
  id: string;
  fullName: string;
  email: string;
  governmentEntityId: string;
  status?: "Active" | "Suspended";
}

// Agency Interface
interface Agency {
  id: string;
  name: string;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [showEditAgencyModal, setShowEditAgencyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  // Form State
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    governmentEntityId: "",
  });
  const [agencyForm, setAgencyForm] = useState({
    name: "",
  });

  // Fetch agencies on mount
  useEffect(() => {
    fetchAgencies();
  }, []);

  // Fetch users when agency is selected
  useEffect(() => {
    if (selectedAgencyId) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [selectedAgencyId]);

  const fetchAgencies = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      const data = await apiClient.getAgencies(token);
      setAgencies(data);
      if (data.length > 0 && !selectedAgencyId) {
        setSelectedAgencyId(data[0].id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch agencies");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!selectedAgencyId) return;
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      setLoading(true);
      const data = await apiClient.getAgencyUsers(selectedAgencyId, token);
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  // Open Add Modal
  const handleAdd = () => {
    if (!selectedAgencyId) {
      toast.error("Please select an agency first");
      return;
    }
    setForm({ fullName: "", email: "", password: "", governmentEntityId: selectedAgencyId });
    setShowAddModal(true);
  };
  // Save User
  const saveUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      if (!form.fullName || !form.email || !form.password || !form.governmentEntityId) {
        toast.error("Please fill all fields");
        return;
      }
      await apiClient.createAgencyUser(form, token);
      toast.success("User created successfully");
      setShowAddModal(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    }
  };
  // Activate User
  const handleActivate = async (user: User) => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      await apiClient.activateUser(user.id, token);
      toast.success("User activated successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to activate user");
    }
  };
  // Deactivate User
  const handleDeactivate = async (user: User) => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      await apiClient.deactivateUser(user.id, token);
      toast.success("User deactivated successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate user");
    }
  };
  // Delete Modal
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      await apiClient.deactivateUser(selectedUser!.id, token);
      toast.success("User deactivated successfully");
      setShowDeleteModal(false);
      fetchUsers();
      // Reset to first page if current page is empty after delete
      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate user");
    }
  };
  // Agency Management
  const handleAddAgency = () => {
    setAgencyForm({ name: "" });
    setShowAgencyModal(true);
  };
  const saveAgency = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      if (!agencyForm.name) {
        toast.error("Please enter agency name");
        return;
      }
      await apiClient.createAgency(agencyForm, token);
      toast.success("Agency created successfully");
      setShowAgencyModal(false);
      await fetchAgencies();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to create agency");
    }
  };
  const handleEditAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setAgencyForm({ name: agency.name });
    setShowEditAgencyModal(true);
  };
  const saveEditAgency = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      if (!agencyForm.name || !selectedAgency) {
        toast.error("Please enter agency name");
        return;
      }
      await apiClient.updateAgency(selectedAgency.id, agencyForm, token);
      toast.success("Agency updated successfully");
      setShowEditAgencyModal(false);
      await fetchAgencies();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update agency");
    }
  };
  const handleDeleteAgency = async (agency: Agency) => {
    if (!confirm(`Are you sure you want to delete ${agency.name}?`)) {
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      await apiClient.deleteAgency(agency.id, token);
      toast.success("Agency deleted successfully");
      await fetchAgencies();
      if (selectedAgencyId === agency.id && agencies.length > 1) {
        const remainingAgencies = agencies.filter(a => a.id !== agency.id);
        if (remainingAgencies.length > 0) {
          setSelectedAgencyId(remainingAgencies[0].id);
        } else {
          setSelectedAgencyId("");
          setUsers([]);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete agency");
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AGENCIES SIDEBAR */}
        <div className="lg:col-span-3 bg-white p-4 sm:p-5 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 size={20} /> Agencies
            </h2>
            <button
              onClick={handleAddAgency}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {agencies.map((agency) => (
              <div
                key={agency.id}
                className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                  selectedAgencyId === agency.id
                    ? "bg-blue-50 border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedAgencyId(agency.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{agency.name}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAgency(agency);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAgency(agency);
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="lg:col-span-9 bg-white p-4 sm:p-5 rounded-xl shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold">Employees</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by Name, Email or ID"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="flex-1 sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAdd}
                disabled={!selectedAgencyId}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} /> Add User
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Agency</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{user.id.substring(0, 8)}...</td>
                    <td className="p-3">{user.fullName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      {agencies.find(a => a.id === user.governmentEntityId)?.name || "N/A"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-lg text-sm bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleActivate(user)}
                          className="text-green-600 hover:text-green-800"
                          title="Activate"
                        >
                          <span className="text-xs">✓</span>
                        </button>
                        <button
                          onClick={() => handleDeactivate(user)}
                          className="text-orange-600 hover:text-orange-800"
                          title="Deactivate"
                        >
                          <span className="text-xs">✗</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm font-medium">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              {selectedAgencyId 
                ? "No employees found matching the search criteria."
                : "Please select an agency to view employees."}
            </div>
          )}
            </>
          )}
        </div>
      </div>
      {/* ADD USER MODAL */}
      {showAddModal && (
        <Modal title="Add User" onClose={() => setShowAddModal(false)}>
          <UserForm form={form} setForm={setForm} onSubmit={saveUser} agencies={agencies} />
        </Modal>
      )}
      {/* DELETE USER MODAL */}
      {showDeleteModal && (
        <Modal title="Deactivate User" onClose={() => setShowDeleteModal(false)}>
          <p className="mb-4">Are you sure you want to deactivate <b>{selectedUser?.fullName}</b>?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Deactivate
            </button>
          </div>
        </Modal>
      )}
      {/* ADD AGENCY MODAL */}
      {showAgencyModal && (
        <Modal title="Add Agency" onClose={() => setShowAgencyModal(false)}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Agency Name"
              value={agencyForm.name}
              onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={saveAgency}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
      {/* EDIT AGENCY MODAL */}
      {showEditAgencyModal && (
        <Modal title="Edit Agency" onClose={() => setShowEditAgencyModal(false)}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Agency Name"
              value={agencyForm.name}
              onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={saveEditAgency}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
// Modal Component
const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md sm:w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);
// Form Component
const UserForm = ({
  form,
  setForm,
  onSubmit,
  agencies,
}: {
  form: any;
  setForm: any;
  onSubmit: () => void;
  agencies: Agency[];
}) => (
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Full Name"
      value={form.fullName}
      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      className="w-full p-2 border rounded-lg"
      required
    />
    <input
      type="email"
      placeholder="Email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      className="w-full p-2 border rounded-lg"
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={form.password}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      className="w-full p-2 border rounded-lg"
      required
    />
    <select
      value={form.governmentEntityId}
      onChange={(e) => setForm({ ...form, governmentEntityId: e.target.value })}
      className="w-full p-2 border rounded-lg"
      required
    >
      <option value="">Select Agency</option>
      {agencies.map((agency) => (
        <option key={agency.id} value={agency.id}>
          {agency.name}
        </option>
      ))}
    </select>
    <button
      onClick={onSubmit}
      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Save
    </button>
  </div>
);
export default Page;