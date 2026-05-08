"use client";

import { useHeatmap } from "@/lib/hooks/useHeatmap";

interface HeatmapGridProps {
  habitId: string;
  year?: number;
}

export default function HeatmapGrid({ habitId, year = new Date().getFullYear() }: HeatmapGridProps) {
  const { data: heatmap, isLoading } = useHeatmap(habitId, year);
  const today = new Date().toISOString().split('T')[0];

  // Group by weeks for the grid
  const weeks = [];
  if (heatmap) {
    for (let i = 0; i < heatmap.data.length; i += 7) {
      weeks.push(heatmap.data.slice(i, i + 7));
    }
  }

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return (
    <div className="flex flex-col space-y-2">
      {/* Month Labels */}
      <div className="flex text-[8px] text-textMuted font-mono">
        {months.map(m => (
          <div key={m} className="flex-1 text-left">{m}</div>
        ))}
      </div>

      <div className="flex gap-[2px]">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[2px]">
            {week.map((day, dIdx) => {
              const isToday = day.date === today;
              let bgColor = "#111111"; // empty
              
              // We need to check if the date actually has a log in the backend data
              // The hook pre-fills with empty data, so we need to know if 'completed' was actually set.
              // In our implementation, we'll assume the API returns the real log status.
              if (day.value !== undefined) {
                bgColor = day.completed ? "#22c55e" : "#661010";
              }

              return (
                <div
                  key={dIdx}
                  title={`${day.date}: ${day.value || 0}`}
                  className="w-[10px] h-[10px]"
                  style={{
                    backgroundColor: bgColor,
                    outline: isToday ? "1px solid #ff2020" : "none",
                    outlineOffset: isToday ? "1px" : "0"
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
