"use client";

import { useEffect, useState } from "react";
import { useHabits } from "@/lib/hooks/useHabits";
import api from "@/lib/api";
import { User } from "@/lib/types";
import HabitCard from "@/components/dashboard/HabitCard";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const { habits, isLoading: habitsLoading } = useHabits();
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

  if (habitsLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgPrimary">
        <div className="font-mono text-textMuted animate-pulse letter-spacing-widest">
          LOADING ARENA...
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
      <header className="h-16 border-b border-border flex items-center justify-between px-8 sticky top-0 bg-bgPrimary/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-6">
          <span className="font-mono text-sm text-textPrimary uppercase tracking-[2px]">
            {user.username}
          </span>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="font-mono text-[10px] text-textPrimary uppercase tracking-[2px] border-b border-accentRed">ARENA</Link>
            <Link href="/dashboard/locker-room" className="font-mono text-[10px] text-textSecondary hover:text-textPrimary uppercase tracking-[2px]">LOCKER ROOM</Link>
            <Link href="/dashboard/settings" className="font-mono text-[10px] text-textSecondary hover:text-textPrimary uppercase tracking-[2px]">SETTINGS</Link>
          </nav>
        </div>
        <div className="font-mono text-xs text-textSecondary uppercase tracking-[2px]">
          TOTAL STREAK: <span className="text-accentRed font-bold">12 DAYS</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
          
          {habits.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-border">
              <p className="font-mono text-textMuted uppercase tracking-[4px]">
                NO ACTIVE CONTRACTS.
              </p>
              <Link 
                href="/dashboard/settings" 
                className="inline-block mt-4 font-mono text-xs text-accentRed uppercase tracking-[2px] hover:underline"
              >
                + ADD HABIT
              </Link>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
