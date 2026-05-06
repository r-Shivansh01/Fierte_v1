"use client";

import { useState } from "react";

interface GoalInputProps {
  onSubmit: (goal: string) => void;
}

export default function GoalInput({ onSubmit }: GoalInputProps) {
  const [goal, setGoal] = useState("");

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-display font-black text-6xl text-textPrimary uppercase mb-12 text-center">
        WHAT ARE YOU TRYING TO BECOME?
      </h1>
      
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="w-full max-w-[600px] bg-transparent border-b border-border py-4 font-mono text-xl text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-textSecondary transition-colors resize-none"
        placeholder="ENTER YOUR AMBITION..."
        rows={3}
      />
      
      <p className="font-mono text-xs text-textMuted uppercase mt-4 tracking-[2px]">
        Be honest. Be specific. This is your contract.
      </p>

      <button
        onClick={() => goal.trim() && onSubmit(goal)}
        className="w-full max-w-[600px] bg-accentRed text-white py-4 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-[#cc0000] transition-colors mt-12"
      >
        SUBMIT TO THE PROCESS
      </button>
    </div>
  );
}
