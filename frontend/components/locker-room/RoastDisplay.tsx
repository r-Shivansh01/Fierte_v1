"use client";

interface RoastDisplayProps {
  message: string;
  verdict: 'PASS' | 'FAIL' | 'PERFECT';
}

export default function RoastDisplay({ message, verdict }: RoastDisplayProps) {
  const textColors = {
    PERFECT: "text-success",
    PASS: "text-textSecondary",
    FAIL: "text-[#cc2222]",
  };

  return (
    <div className={`font-mono text-sm leading-relaxed ${textColors[verdict]}`}>
      {message}
    </div>
  );
}
