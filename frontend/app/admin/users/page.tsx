"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Search, UserPlus, Filter, Edit2, Trash2, ChevronLeft, ChevronRight, User as UserIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  state: string;
  lastSync: string;
}

interface UsersResponse {
  items: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER"
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: async () => {
      const response = await api.get<UsersResponse>(`/admin/users?skip=${(page - 1) * limit}&limit=${limit}`);
      return response.data;
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: any) => {
      await api.post('/admin/users', newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setIsRegisterOpen(false);
      setFormData({ username: "", email: "", password: "", role: "USER" });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      await api.put(`/admin/users/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setIsEditOpen(false);
      setEditingUser(null);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const usersData = data?.items || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(formData);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        updates: { username: formData.username, role: formData.role }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("WARNING: This will permanently delete the user and all associated data. Proceed?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({ ...formData, username: user.name, role: user.role });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">Users</h1>
          <div className="text-xs text-textSecondary font-bold tracking-widest uppercase">
            Total_Count: {totalCount}_Nodes
          </div>
        </div>
        <button 
          onClick={() => {
            setFormData({ username: "", email: "", password: "", role: "USER" });
            setIsRegisterOpen(true);
          }}
          className="px-6 py-2 bg-white text-bgPrimary font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Register User
        </button>
      </div>

      {/* Filters & Table Container */}
      <div className="bg-bgSecondary border border-border">
        {/* Filters */}
        <div className="p-6 border-b border-border flex items-end justify-between flex-wrap gap-4">
          <div className="flex gap-8">
            <div className="space-y-2">
              <label className="text-xs text-white uppercase tracking-widest block font-bold">Search_Alias</label>
              <input 
                type="text" 
                placeholder="UID_OR_NAME..." 
                className="bg-transparent border-b border-border text-sm text-white px-0 py-2 focus:outline-none focus:border-textSecondary transition-colors w-64 placeholder:text-textMuted uppercase tracking-wider"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white uppercase tracking-widest block font-bold">Role_Class</label>
              <select className="bg-transparent border-b border-border text-sm text-white px-0 py-2 focus:outline-none focus:border-textSecondary transition-colors w-48 uppercase tracking-wider appearance-none cursor-pointer">
                <option className="bg-bgSecondary">ALL_TYPES</option>
                <option className="bg-bgSecondary">ROOT_ADMIN</option>
                <option className="bg-bgSecondary">USER</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 border border-transparent text-white text-sm uppercase tracking-wider hover:bg-bgCard transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced
            </button>
            <button className="px-6 py-2 border border-border text-white text-sm uppercase tracking-wider hover:bg-white hover:text-bgPrimary transition-colors font-bold">
              Apply
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px] text-textSecondary uppercase tracking-widest font-mono text-sm animate-pulse">
              LOADING_NODES...
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-[300px] text-accentRed uppercase tracking-widest font-mono text-sm">
              ERROR_FETCHING_NODES
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-textSecondary uppercase tracking-widest border-b border-border bg-bgPrimary/30">
                <tr>
                  <th className="px-6 py-4 font-normal">Identity_Name</th>
                  <th className="px-6 py-4 font-normal">Role_ID</th>
                  <th className="px-6 py-4 font-normal">State</th>
                  <th className="px-6 py-4 font-normal">Last_Sync</th>
                  <th className="px-6 py-4 font-normal text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usersData.map((user) => (
                  <tr key={user.id} className="hover:bg-bgCard/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-border flex items-center justify-center relative overflow-hidden group">
                           <UserIcon className="w-5 h-5 text-textSecondary" />
                           <div className="absolute inset-0 bg-accentRed/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm tracking-wider">{user.name}</div>
                          <div className="text-textSecondary text-xs font-mono mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-border text-white bg-bgPrimary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center text-xs font-bold tracking-widest uppercase ${user.state === 'ACTIVE' ? 'text-success' : 'text-accentRed'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${user.state === 'ACTIVE' ? 'bg-success' : 'bg-accentRed'}`}></span>
                        {user.state}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-textSecondary font-mono text-xs tracking-wider">
                      {user.lastSync}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 border border-border text-textSecondary hover:text-white hover:border-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 border border-border text-textSecondary hover:text-accentRed hover:border-accentRed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-xs text-textSecondary uppercase tracking-widest font-mono">
            Page_{page.toString().padStart(2, '0')}_OF_{totalPages.toString().padStart(2, '0')}
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center border border-transparent text-textSecondary hover:text-white hover:bg-bgCard transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-bgPrimary font-bold text-xs">
              {page}
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-8 h-8 flex items-center justify-center border border-transparent text-textSecondary hover:text-white hover:bg-bgCard transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Register User Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bgSecondary border border-border p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsRegisterOpen(false)}
                className="absolute top-4 right-4 text-textSecondary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-6">Register Node</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-textSecondary uppercase tracking-widest font-bold">Email_Address</label>
                  <input 
                    type="email" required
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-bgPrimary border border-border text-sm text-white p-3 focus:outline-none focus:border-accentRed transition-colors font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-textSecondary uppercase tracking-widest font-bold">Alias_Name</label>
                  <input 
                    type="text" required
                    value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-bgPrimary border border-border text-sm text-white p-3 focus:outline-none focus:border-accentRed transition-colors font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-textSecondary uppercase tracking-widest font-bold">Auth_Key</label>
                  <input 
                    type="password" required
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-bgPrimary border border-border text-sm text-white p-3 focus:outline-none focus:border-accentRed transition-colors font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-textSecondary uppercase tracking-widest font-bold">Role_Class</label>
                  <select 
                    value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-bgPrimary border border-border text-sm text-white p-3 focus:outline-none focus:border-accentRed transition-colors font-mono appearance-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ROOT_ADMIN">ROOT_ADMIN</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={createUserMutation.isPending}
                  className="w-full mt-4 bg-white text-bgPrimary py-3 font-mono text-xs font-bold uppercase tracking-[4px] hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {createUserMutation.isPending ? 'DEPLOYING...' : 'INITIALIZE_NODE'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bgSecondary border border-border p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsEditOpen(false)}
                className="absolute top-4 right-4 text-textSecondary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-6">Modify Node</h2>
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-textSecondary uppercase tracking-widest font-bold">Alias_Name</label>
                  <input 
                    type="text" required
                    value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-bgPrimary border border-border text-sm text-white p-3 focus:outline-none focus:border-accentRed transition-colors font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-textSecondary uppercase tracking-widest font-bold">Role_Class</label>
                  <select 
                    value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-bgPrimary border border-border text-sm text-white p-3 focus:outline-none focus:border-accentRed transition-colors font-mono appearance-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ROOT_ADMIN">ROOT_ADMIN</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={updateUserMutation.isPending}
                  className="w-full mt-4 bg-white text-bgPrimary py-3 font-mono text-xs font-bold uppercase tracking-[4px] hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {updateUserMutation.isPending ? 'UPDATING...' : 'APPLY_CHANGES'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
