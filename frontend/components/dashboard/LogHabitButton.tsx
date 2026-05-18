"use client";

import { useState } from "react";
import { useHabits } from "@/lib/hooks/useHabits";
import { useHeatmap } from "@/lib/hooks/useHeatmap";

interface LogHabitButtonProps {
  habitId: string;
  unit: string;
  target: number;
}

export default function LogHabitButton({ habitId, unit, target }: LogHabitButtonProps) {
  const { logHabit } = useHabits();
  const { data: heatmap } = useHeatmap(habitId);
  const [isLogging, setIsLogging] = useState(false);
  const [value, setValue] = useState("");

  const today = new Date().toISOString().split('T')[0];
  const todayLog = heatmap?.data.find(d => d.date === today);

  const handleLog = async () => {
    if (!value) return;
    const parsedValue = parseFloat(value);
    if (parsedValue < 0) return;
    try {
      await logHabit({ habitId, value: parsedValue });
      setIsLogging(false);
      setValue("");
    } catch (error) {
      console.error("Failed to log habit", error);
    }
  };

  if (todayLog?.completed) {
    return (
      <div className="w-full bg-success/10 border border-success/30 py-4 text-center">
        <span className="font-mono text-xs font-bold text-success tracking-[4px] uppercase">
          ✓ LOGGED TODAY
        </span>
      </div>
    );
  }

  if (todayLog && !todayLog.completed && todayLog.value !== undefined && todayLog.value !== 0) {
    return (
      <div className="w-full bg-accentRedDim/20 border border-accentRedDim/40 py-4 text-center">
        <span className="font-mono text-xs font-bold text-accentRed tracking-[4px] uppercase">
          LOGGED — INCOMPLETE
        </span>
      </div>
    );
  }

  if (isLogging) {
    return (
      <div className="w-full flex flex-col space-y-4">
        <div className="flex items-center gap-4 bg-bgSecondary p-4">
          <input
            type="number"
            min="0"
            placeholder={`VALUE (${unit})`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-transparent font-mono text-sm text-textPrimary focus:outline-none"
            autoFocus
          />
          <button
            onClick={handleLog}
            className="font-mono text-xs font-bold text-accentRed tracking-[2px] uppercase"
          >
            CONFIRM
          </button>
        </div>
        <button
          onClick={() => setIsLogging(false)}
          className="font-mono text-[10px] text-textMuted uppercase tracking-[2px]"
        >
          CANCEL
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsLogging(true)}
      className="w-full bg-accentRed text-white py-4 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-[#cc0000] transition-colors"
    >
      LOG TODAY
    </button>
  );
}
