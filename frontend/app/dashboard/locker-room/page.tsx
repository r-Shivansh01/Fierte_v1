"use client";

import { useEvaluations } from "@/lib/hooks/useEvaluations";
import EvaluationCard from "@/components/locker-room/EvaluationCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function LockerRoomPage() {
  const { data: evaluations, isLoading } = useEvaluations();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get<User>("/auth/me");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgPrimary">
        <div className="font-mono text-textMuted animate-pulse letter-spacing-widest">
          ENTERING LOCKER ROOM...
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-bgPrimary flex flex-col"
    >
      {/* Top Bar */}
      <header className="border-b border-border sticky top-0 bg-bgPrimary/80 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between px-4 sm:px-8 h-12 sm:h-16">
          <span className="font-mono text-xs sm:text-sm text-textPrimary uppercase tracking-[2px] shrink-0">
            {user.username}
          </span>
        </div>
        <nav className="flex gap-4 px-4 sm:px-8 pb-2 overflow-x-auto">
          <Link href="/dashboard" className="font-mono text-[10px] text-textSecondary hover:text-textPrimary uppercase tracking-[2px] whitespace-nowrap">ARENA</Link>
          <Link href="/dashboard/locker-room" className="font-mono text-[10px] text-textPrimary uppercase tracking-[2px] border-b border-accentRed whitespace-nowrap">LOCKER ROOM</Link>
          <Link href="/dashboard/settings" className="font-mono text-[10px] text-textSecondary hover:text-textPrimary uppercase tracking-[2px] whitespace-nowrap">SETTINGS</Link>
          {user.role === "ROOT_ADMIN" && (
            <Link href="/admin" className="font-mono text-[10px] text-accentRed hover:text-white uppercase tracking-[2px] whitespace-nowrap">ADMIN</Link>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8 max-w-[800px] mx-auto w-full">
        <h1 className="font-display font-black text-2xl sm:text-4xl text-textPrimary uppercase mb-2 tracking-tight">
          THE LOCKER ROOM
        </h1>
        <p className="font-mono text-xs text-textMuted uppercase tracking-[3px] mb-8 sm:mb-12">
          What happened when you thought no one was watching.
        </p>

        <div className="space-y-8">
          {evaluations?.map((evaluation) => (
            <EvaluationCard key={evaluation.id} evaluation={evaluation} />
          ))}

          {evaluations?.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-mono text-textMuted uppercase tracking-[4px]">
                THE LOCKER ROOM IS EMPTY. COME BACK TOMORROW.
              </p>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
