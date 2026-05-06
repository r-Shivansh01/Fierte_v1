"use client";

import { useEffect, useState } from "react";
import { useHabits } from "@/lib/hooks/useHabits";
import api from "@/lib/api";
import { User, Habit } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { habits, createHabit, deleteHabit, isLoading: habitsLoading } = useHabits();
  const [user, setUser] = useState<User | null>(null);

  // Add Habit Form
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newUnit, setNewUnit] = useState("reps");

  // Reset Flow
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetInput, setResetInput] = useState("");

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

  const handleAddHabit = async () => {
    if (!newName || !newTarget) return;
    try {
      await createHabit({
        name: newName,
        description: newDesc,
        target_value: parseFloat(newTarget),
        target_unit: newUnit
      });
      setNewName("");
      setNewDesc("");
      setNewTarget("");
    } catch (error) {
      console.error("Failed to add habit", error);
    }
  };

  const handleResetContract = async () => {
    if (resetInput !== "RESET") return;
    try {
      // The spec says: DELETE all habits for user, set is_onboarded = false via PUT /auth/me, redirect to /onboarding
      // We'll assume a single "reset" endpoint or do it sequentially
      // For now, we'll do what's explicitly requested:
      
      // 1. Delete all habits (cascades to logs in DB)
      for (const habit of habits) {
        await api.delete(`/habits/${habit.id}`);
      }
      
      // 2. Set is_onboarded = false
      await api.put("/auth/me", { is_onboarded: false });
      
      // 3. Clear token and redirect
      localStorage.removeItem("fierté_token");
      router.push("/onboarding");
    } catch (error) {
      console.error("Reset failed", error);
    }
  };

  if (habitsLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgPrimary">
        <div className="font-mono text-textMuted animate-pulse letter-spacing-widest">
          ACCESSING SETTINGS...
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
            <Link href="/dashboard" className="font-mono text-[10px] text-textSecondary hover:text-textPrimary uppercase tracking-[2px]">ARENA</Link>
            <Link href="/dashboard/locker-room" className="font-mono text-[10px] text-textSecondary hover:text-textPrimary uppercase tracking-[2px]">LOCKER ROOM</Link>
            <Link href="/dashboard/settings" className="font-mono text-[10px] text-textPrimary uppercase tracking-[2px] border-b border-accentRed">SETTINGS</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-[800px] mx-auto w-full space-y-16">
        {/* Active Habits */}
        <section>
          <h2 className="font-display font-black text-2xl text-textPrimary uppercase mb-8 tracking-tight">
            ACTIVE HABITS
          </h2>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="bg-bgCard border border-border p-4 flex justify-between items-center">
                <div>
                  <div className="font-mono text-sm text-textPrimary uppercase">{habit.name}</div>
                  <div className="font-mono text-[10px] text-textSecondary uppercase">
                    {habit.target_value} {habit.target_unit}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (confirm("Removing this is an admission of defeat. Proceed?")) {
                      deleteHabit(habit.id);
                    }
                  }}
                  className="font-mono text-[10px] text-accentRed hover:underline uppercase tracking-[1px]"
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Add Habit */}
        <section className="border-t border-border pt-16">
          <h2 className="font-display font-black text-2xl text-textPrimary uppercase mb-8 tracking-tight">
            ADD HABIT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="HABIT NAME" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-bgSecondary border border-border p-3 font-mono text-xs text-textPrimary focus:outline-none" 
            />
            <input 
              placeholder="TARGET VALUE" 
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="bg-bgSecondary border border-border p-3 font-mono text-xs text-textPrimary focus:outline-none" 
            />
            <select 
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="bg-bgSecondary border border-border p-3 font-mono text-xs text-textPrimary focus:outline-none appearance-none"
            >
              <option value="reps">REPS</option>
              <option value="minutes">MINUTES</option>
              <option value="km">KM</option>
              <option value="pages">PAGES</option>
            </select>
            <input 
              placeholder="DESCRIPTION (OPTIONAL)" 
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="bg-bgSecondary border border-border p-3 font-mono text-xs text-textPrimary focus:outline-none" 
            />
            <button 
              onClick={handleAddHabit}
              className="md:col-span-2 bg-textPrimary text-bgPrimary py-4 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors"
            >
              ADD TO CONTRACT
            </button>
          </div>
        </section>

        {/* Reset Contract */}
        <section className="border-t border-border pt-16 pb-24">
          <h2 className="font-display font-black text-2xl text-accentRed uppercase mb-8 tracking-tight">
            RESET CONTRACT
          </h2>
          
          {!showResetConfirm ? (
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="border border-accentRed text-accentRed py-4 px-8 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-accentRed hover:text-white transition-colors"
            >
              RESTART FROM ZERO
            </button>
          ) : (
            <div className="bg-accentRed/5 border border-accentRed/20 p-6 space-y-6">
              <p className="font-mono text-xs text-accentRed uppercase leading-relaxed">
                Are you resetting because you failed? Thought so. Type <span className="font-bold">RESET</span> to confirm your surrender.
              </p>
              <input 
                placeholder="TYPE RESET" 
                value={resetInput}
                onChange={(e) => setResetInput(e.target.value)}
                className="w-full bg-transparent border-b border-accentRed py-2 font-mono text-sm text-textPrimary focus:outline-none" 
              />
              <div className="flex gap-4">
                <button 
                  onClick={handleResetContract}
                  disabled={resetInput !== "RESET"}
                  className="bg-accentRed text-white py-3 px-8 font-mono text-[10px] font-bold tracking-[3px] uppercase disabled:opacity-30"
                >
                  CONFIRM RESET
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="text-textSecondary font-mono text-[10px] uppercase tracking-[2px]"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </motion.div>
  );
}
