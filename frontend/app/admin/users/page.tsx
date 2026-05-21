"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Search, UserPlus, Filter, Edit2, Trash2, ChevronLeft, ChevronRight, User as UserIcon } from "lucide-react";

interface AdminUser {
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
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: async () => {
      const response = await api.get<UsersResponse>(`/admin/users?skip=${(page - 1) * limit}&limit=${limit}`);
      return response.data;
    }
  });

  const usersData = data?.items || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">Users</h1>
          <div className="text-xs text-textSecondary font-bold tracking-widest uppercase">
            Total_Count: {totalCount}_Nodes
          </div>
        </div>
        <button className="px-6 py-2 bg-white text-bgPrimary font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-2">
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
                <option className="bg-bgSecondary">OPS_DEV</option>
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
                {usersData.map((user, i) => (
                  <tr key={i} className="hover:bg-bgCard/50 transition-colors">
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
                        <button className="p-2 border border-border text-textSecondary hover:text-white hover:border-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 border border-border text-textSecondary hover:text-accentRed hover:border-accentRed transition-colors">
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
    </div>
  );
}
