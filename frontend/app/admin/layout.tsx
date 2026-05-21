"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Server,
  FileText,
  LogOut,
  Bell,
  HelpCircle,
  Search,
  User as UserIcon,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "System Status", href: "/admin/system-status", icon: Server },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Disconnect from SYS_ADMIN?")) {
      localStorage.removeItem("fierté_token");
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen bg-bgPrimary text-textPrimary overflow-hidden font-mono selection:bg-accentRed selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-bgSecondary border-r border-border h-full flex-shrink-0 relative z-10">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-display font-bold tracking-widest text-white uppercase">Fièrté</h1>
          <p className="text-xs text-textSecondary mt-1 uppercase tracking-wider">SYS_ADMIN_V1</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="flex items-center px-6 py-3 text-sm text-textSecondary hover:text-white hover:bg-bgCard transition-colors group"
                >
                  <link.icon className="w-5 h-5 mr-4 opacity-70 group-hover:opacity-100" />
                  <span className="uppercase tracking-wider">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-border space-y-4">
          <button className="flex items-center text-sm text-textSecondary hover:text-white w-full uppercase tracking-wider group">
            <FileText className="w-5 h-5 mr-4 opacity-70 group-hover:opacity-100" />
            Documentation
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm text-textSecondary hover:text-accentRed w-full uppercase tracking-wider group"
          >
            <LogOut className="w-5 h-5 mr-4 opacity-70 group-hover:opacity-100" />
            Logout
          </button>

          <div className="pt-6 mt-4 border-t border-border flex items-center">
            <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center mr-3 overflow-hidden">
               <UserIcon className="w-4 h-4 text-textSecondary" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase">ROOT_USER</p>
              <p className="text-[10px] text-success flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-bgPrimary relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-bgPrimary flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-8">
            <span className="font-bold text-sm tracking-widest text-white uppercase">FIERTE_CORE</span>
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="QUERY_SYSTEM..."
                className="bg-bgSecondary border border-border text-sm text-white px-10 py-1.5 focus:outline-none focus:border-textSecondary transition-colors w-64 placeholder:text-textMuted uppercase tracking-wider"
              />
            </div>
            <div className="flex gap-6 text-sm text-textSecondary uppercase tracking-wider">
              <span className="hover:text-white cursor-pointer border-b border-transparent hover:border-white pb-1 transition-all">Logs</span>
              <span className="hover:text-white cursor-pointer border-b border-transparent hover:border-white pb-1 transition-all">Deployments</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-textSecondary">
            <button className="hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accentRed rounded-full border border-bgPrimary"></span>
            </button>
            <button className="hover:text-white">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-bgSecondary border border-border rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
