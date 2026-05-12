"use client";

import { Habit } from "@/lib/types";
import DifficultyBadge from "./DifficultyBadge";
import HeatmapGrid from "./HeatmapGrid";
import StreakCounter from "./StreakCounter";
import PerformanceStats from "./PerformanceStats";
import LogHabitButton from "./LogHabitButton";
import { useHeatmap } from "@/lib/hooks/useHeatmap";

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const { data: heatmap } = useHeatmap(habit.id);
  const effectiveTarget = habit.target_value * habit.difficulty_multiplier;

  return (
    <div className="bg-bgCard border border-border p-4 sm:p-6 flex flex-col space-y-4 sm:space-y-6 overflow-hidden min-w-0">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-display font-bold text-lg sm:text-2xl text-textPrimary uppercase tracking-tight min-w-0">
          {habit.name}
        </h3>
        <DifficultyBadge 
          level={habit.current_level} 
          multiplier={habit.difficulty_multiplier} 
        />
      </div>

      {habit.description && (
        <p className="font-mono text-xs text-textMuted leading-relaxed -mt-2">
          {habit.description}
        </p>
      )}

      <p className="font-mono text-xs text-textSecondary uppercase tracking-[2px]">
        TARGET: <span className="text-textPrimary">{effectiveTarget.toFixed(2)} {habit.target_unit}</span>
      </p>

      <HeatmapGrid habitId={habit.id} />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-t border-border pt-4 sm:pt-6">
        <div className="flex gap-6 sm:gap-8 flex-wrap">
          <StreakCounter 
            current={heatmap?.current_streak || 0} 
            longest={heatmap?.longest_streak || 0} 
          />
          <PerformanceStats 
            rate={Math.round((heatmap?.completion_rate || 0) * 100)} 
          />
        </div>
      </div>

      <LogHabitButton habitId={habit.id} unit={habit.target_unit} target={effectiveTarget} />
    </div>
  );
}
