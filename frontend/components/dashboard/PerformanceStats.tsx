"use client";

interface PerformanceStatsProps {
  rate: number;
}

export default function PerformanceStats({ rate }: PerformanceStatsProps) {
  return (
    <div className="flex flex-col flex-1 max-w-[120px]">
      <div className="font-mono text-xs text-textSecondary uppercase tracking-[2px] mb-2">
        {rate}% COMPLETION
      </div>
      <div className="w-full h-1 bg-border overflow-hidden">
        <div 
          className="h-full bg-success transition-all duration-500" 
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}
