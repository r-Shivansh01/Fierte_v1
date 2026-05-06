"use client";

import { Evaluation } from "@/lib/types";
import RoastDisplay from "./RoastDisplay";

interface EvaluationCardProps {
  evaluation: Evaluation;
}

export default function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const verdictColors = {
    PERFECT: "bg-success text-white",
    PASS: "border border-white text-white",
    FAIL: "bg-accentRed text-white",
  };

  return (
    <div className="bg-bgCard border border-border p-6 flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-textSecondary uppercase tracking-[2px]">
          {new Date(evaluation.evaluation_date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <div className={`px-4 py-1 font-mono text-[10px] font-bold tracking-[3px] uppercase ${verdictColors[evaluation.overall_verdict]}`}>
          {evaluation.overall_verdict}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between font-mono text-[10px] text-textMuted uppercase tracking-[2px]">
          <span>COMPLETION RATE</span>
          <span>{Math.round(evaluation.completion_rate * 100)}%</span>
        </div>
        <div className="w-full h-1 bg-border">
          <div 
            className={`h-full transition-all duration-500 ${
              evaluation.overall_verdict === 'PERFECT' ? 'bg-success' : 
              evaluation.overall_verdict === 'FAIL' ? 'bg-accentRed' : 'bg-textSecondary'
            }`}
            style={{ width: `${evaluation.completion_rate * 100}%` }}
          />
        </div>
      </div>

      <RoastDisplay 
        message={evaluation.ai_message} 
        verdict={evaluation.overall_verdict} 
      />
    </div>
  );
}
