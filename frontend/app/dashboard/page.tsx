"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useHabits } from "@/lib/hooks/useHabits";
import api from "@/lib/api";
import { User, Habit, HeatmapData } from "@/lib/types";
import HabitCard from "@/components/dashboard/HabitCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

function TotalStreak({ habits }: { habits: Habit[] }) {
  const year = new Date().getFullYear();
  const { data: streaks } = useQuery({
    queryKey: ['total-streak', habits.map(h => h.id)],
    queryFn: async () => {
      const results = await Promise.all(
        habits.map(async (habit) => {
          try {
            const { data } = await api.get<HeatmapData>(`/heatmap/${habit.id}`, { params: { year } });
            return data.current_streak;
          } catch {
            return 0;
          }
        })
      );
      return Math.max(...results, 0);
    },
    staleTime: 60000,
  });

  const streak = streaks ?? 0;
  return <>{streak} {streak === 1 ? "DAY" : "DAYS"}</>;
}
export default function DashboardPage() {
  const router = useRouter();
  const { habits, isLoading: habitsLoading } = useHabits();
  const [user, setUser] = useState<User | null>(null);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("fierté_token");
    router.push("/");
  }, [router]);

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

  // Lazy evaluation backfill: generate yesterday's evaluation if the nightly cron missed it
  useEffect(() => {
    const backfill = async () => {
      try {
        await api.post("/evaluations/backfill");
      } catch {
        // Silent fail — backfill is best-effort
      }
    };
    backfill();
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
      <header className="border-b border-border sticky top-0 bg-bgPrimary/80 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between px-4 sm:px-8 h-12 sm:h-16">
          <span className="font-mono text-xs sm:text-sm text-textPrimary uppercase tracking-[2px] shrink-0">
            {user.username}
          </span>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="font-mono text-[10px] sm:text-xs text-textSecondary uppercase tracking-[2px] whitespace-nowrap">
              TOTAL STREAK: <span className="text-accentRed font-bold">{habits.length > 0 ? <TotalStreak habits={habits} /> : "0 DAYS"}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="font-mono text-[10px] text-textMuted hover:text-accentRed uppercase tracking-[2px] transition-colors shrink-0"
            >
              SIGN OUT
            </button>
          </div>
        </div>
        <nav className="flex gap-4 px-4 sm:px-8 pb-2 overflow-x-auto">
          <Link href="/dashboard" className="font-mono text-[10px] text-textPrimary uppercase tracking-[2px] border-b border-accentRed whitespace-nowrap">ARENA</Link>
          <Link href="/dashboard/locker-room" className="font-mono text-[10px] text-textSecondary hover:text-textPrimary uppercase tracking-[2px] whitespace-nowrap">LOCKER ROOM</Link>
          <Link href="/dashboard/settings" className="font-mono text-[10px] text-textSecondary hover:text-textPrimary uppercase tracking-[2px] whitespace-nowrap">SETTINGS</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8 max-w-[1400px] mx-auto">
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
