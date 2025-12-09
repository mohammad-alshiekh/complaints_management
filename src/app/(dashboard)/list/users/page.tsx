"use client";
import React, { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
// Dummy Users
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
}
interface Activity {
  id: number;
  userId: number;
  action: string;
  timestamp: string;
}
const initialUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@gov.com", role: "Employee", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@gov.com", role: "Employee", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@gov.com", role: "Employee", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@gov.com", role: "Employee", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@gov.com", role: "Employee", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@gov.com", role: "Employee", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@gov.com", role: "Employee", status: "Active" },

  { id: 3, name: "Mark Johnson", email: "mark@gov.com", role: "Employee", status: "Suspended" },
];
const Page = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    status: "Active",
  });
  // Open Add Modal
  const handleAdd = () => {
    setForm({ name: "", email: "", password: "", role: "Employee", status: "Active" });
    setShowAddModal(true);
  };
  // Save User
  const saveUser = () => {
    setUsers([
      ...users,
      {
        id: Date.now(),
        ...form,
      },
    ]);
    setShowAddModal(false);
  };
  // Open Edit Modal
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setForm({ ...user, password: "" }); // Reset password for edit
    setShowEditModal(true);
  };
  // Save Edited User
  const saveEditUser = () => {
    const updatedForm = { ...form };
    // Do not update password if empty for edit
    if (!updatedForm.password) {
      // delete updatedForm.password;
    }
    setUsers(
      users.map((u) =>
        u.id === selectedUser?.id ? { ...u, ...updatedForm } : u
      )
    );
    setShowEditModal(false);
  };
  // Delete Modal
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser?.id));
    setShowDeleteModal(false);
    // Reset to first page if current page is empty after delete
    if (paginatedUsers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* USERS TABLE */}
        <div className="lg:col-span-12 bg-white p-4 sm:p-5 rounded-xl shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold">Employees</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by Name or ID"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="flex-1 sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 self-start sm:self-auto"
              >
                <Plus size={18} /> Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      {user.status === "Active" ? (
                        <span className="px-2 py-1 rounded-lg text-sm bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-sm bg-red-100 text-red-700">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
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
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No employees found matching the search criteria.
            </div>
          )}
        </div>
      </div>
      {/* ADD USER MODAL */}
      {showAddModal && (
        <Modal title="Add User" onClose={() => setShowAddModal(false)}>
          <UserForm form={form} setForm={setForm} onSubmit={saveUser} />
        </Modal>
      )}
      {/* EDIT USER MODAL */}
      {showEditModal && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)}>
          <UserForm form={form} setForm={setForm} onSubmit={saveEditUser} isEdit={true} />
        </Modal>
      )}
      {/* DELETE USER MODAL */}
      {showDeleteModal && (
        <Modal title="Delete User" onClose={() => setShowDeleteModal(false)}>
          <p className="mb-4">Are you sure you want to delete <b>{selectedUser?.name}</b>?</p>
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
              Delete
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
  isEdit = false,
}: {
  form: any;
  setForm: any;
  onSubmit: () => void;
  isEdit?: boolean;
}) => (
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="w-full p-2 border rounded-lg"
    />
    <input
      type="email"
      placeholder="Email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      className="w-full p-2 border rounded-lg"
    />
    {!isEdit && (
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full p-2 border rounded-lg"
      />
    )}
    <select
      value={form.role}
      onChange={(e) => setForm({ ...form, role: e.target.value })}
      className="w-full p-2 border rounded-lg"
    >
      <option>Employee</option>
      <option>Supervisor</option>
      <option>Admin</option>
    </select>
    <select
      value={form.status}
      onChange={(e) => setForm({ ...form, status: e.target.value })}
      className="w-full p-2 border rounded-lg"
    >
      <option>Active</option>
      <option>Suspended</option>
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