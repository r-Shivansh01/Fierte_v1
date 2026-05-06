"use client";

import { useEffect, useState } from "react";
import { useOnboardingStore } from "@/lib/store/onboardingStore";
import { motion } from "framer-motion";

interface HabitNegotiationProps {
  onAccept: (habits: any[]) => void;
  onRenegotiate: (habits: any[]) => void;
}

export default function HabitNegotiation({ onAccept, onRenegotiate }: HabitNegotiationProps) {
  const { isThinking, proposedHabits, setProposedHabits, error } = useOnboardingStore();
  const [thinkingText, setThinkingText] = useState("ANALYZING...");

  useEffect(() => {
    if (isThinking) {
      const texts = ["ANALYZING...", "CUTTING THE FAT...", "BUILDING YOUR CONTRACT..."];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setThinkingText(texts[i]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  const handleValueChange = (index: number, value: string) => {
    const newHabits = [...proposedHabits];
    newHabits[index].target_value = parseFloat(value) || 0;
    setProposedHabits(newHabits);
  };

  if (isThinking) {
    return (
      <div className="flex items-center justify-center">
        <h2 className="font-mono text-4xl text-textPrimary tracking-[8px] animate-pulse uppercase">
          {thinkingText}
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="font-mono text-2xl text-accentRed tracking-[4px] uppercase mb-8">
          ERROR: {error}
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="border border-border text-textPrimary px-8 py-3 font-mono text-xs tracking-[4px] uppercase hover:bg-bgSecondary transition-colors"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-display font-black text-4xl text-textPrimary uppercase mb-12 tracking-tight">
        YOUR PROPOSED CONTRACT
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {proposedHabits.map((habit, idx) => (
          <div key={idx} className="bg-bgCard border border-border p-6 flex flex-col">
            <h3 className="font-display font-bold text-2xl text-textPrimary uppercase mb-2">
              {habit.name}
            </h3>
            <p className="font-mono text-sm text-textSecondary mb-6 flex-grow">
              {habit.description}
            </p>
            <div className="flex items-center justify-between border-t border-border pt-6">
              <span className="font-mono text-sm text-accentRed tracking-[2px] uppercase">
                TARGET:
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={habit.target_value}
                  onChange={(e) => handleValueChange(idx, e.target.value)}
                  className="bg-transparent border-b border-border w-16 font-mono text-right text-textPrimary focus:outline-none focus:border-accentRed"
                />
                <span className="font-mono text-sm text-textSecondary uppercase">
                  {habit.target_unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full mt-12">
        <button
          onClick={() => onAccept(proposedHabits)}
          className="flex-1 bg-accentRed text-white py-4 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-[#cc0000] transition-colors"
        >
          ACCEPT CONTRACT
        </button>
        <button
          onClick={() => onRenegotiate(proposedHabits)}
          className="flex-1 border border-textPrimary text-textPrimary py-4 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-white hover:text-black transition-colors"
        >
          RENEGOTIATE
        </button>
      </div>
    </div>
  );
}
