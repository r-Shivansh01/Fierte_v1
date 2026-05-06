"use client";

interface DifficultyBadgeProps {
  level: number;
  multiplier: number;
}

export default function DifficultyBadge({ level, multiplier }: DifficultyBadgeProps) {
  const overload = Math.round((multiplier - 1) * 100);

  return (
    <div className="flex items-center gap-2 border border-border px-2 py-0.5 bg-bgSecondary">
      <span className="font-mono text-[10px] font-bold text-textPrimary uppercase">
        LVL {level}
      </span>
      {overload > 0 && (
        <span className="font-mono text-[10px] font-bold text-accentRed uppercase">
          +{overload}% OVERLOAD
        </span>
      )}
    </div>
  );
}
