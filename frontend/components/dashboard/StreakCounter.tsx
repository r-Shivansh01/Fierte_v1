"use client";

interface StreakCounterProps {
  current: number;
  longest: number;
}

export default function StreakCounter({ current, longest }: StreakCounterProps) {
  return (
    <div className="flex flex-col">
      <div className="font-mono text-xs text-textSecondary uppercase tracking-[2px] mb-1">
        🔥 <span className="text-accentRed font-bold">{current} DAY STREAK</span>
      </div>
      <div className="font-mono text-[10px] text-textMuted uppercase tracking-[1px]">
        BEST: {longest} DAYS
      </div>
    </div>
  );
}
