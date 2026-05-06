"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-bgPrimary flex flex-col items-center">
      {/* Header */}
      <header className="fixed top-0 w-full h-12 flex items-center justify-between px-8 z-50">
        <div className="font-display font-extrabold text-[13px] tracking-[4px] text-textPrimary uppercase">
          FIÈRTÉ
        </div>
        <Link 
          href="/login" 
          className="font-mono text-[11px] tracking-[3px] text-textSecondary hover:text-textPrimary transition-colors uppercase"
        >
          SIGN IN
        </Link>
      </header>

      {/* Above Fold */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="font-mono text-[11px] tracking-[4px] text-textMuted uppercase mb-8">
            HABIT TRACKER / EGO ENGINE / v1.0
          </div>
          
          <h1 className="font-display font-black text-[clamp(52px,10vw,112px)] leading-[0.92] tracking-[-2px] text-textPrimary uppercase mb-12">
            <span className="block">NO EXCUSES.</span>
            <span className="block">NO PARTICIPATION</span>
            <span className="block text-accentRed">TROPHIES.</span>
          </h1>

          <div className="flex flex-col items-center mt-12">
            <p className="font-mono text-base text-textSecondary tracking-[2px] uppercase mb-6">
              Only output.
            </p>
            <Link
              href="/register"
              className="bg-accentRed text-white px-10 py-3.5 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-[#cc0000] transition-colors"
            >
              CLAIM YOUR SPOT
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-textMuted tracking-[2px]">
          ↓
        </div>
      </section>

      {/* Below Fold - Ghost Preview */}
      <section className="w-full max-w-[900px] py-[120px] px-6">
        <div className="font-mono text-[11px] tracking-[5px] text-textMuted uppercase mb-8">
          WHAT AWAITS YOU
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.72 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative bg-bgCard border border-border p-8 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-12 items-start overflow-hidden"
        >
          {/* Fading overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bgPrimary pointer-events-none" />

          {/* Habit Label */}
          <div>
            <h3 className="font-display font-bold text-xl text-textPrimary uppercase">DAILY OUTPUT</h3>
            <p className="font-mono text-xs text-textSecondary tracking-[2px] mt-2">TARGET: 4.00 hrs</p>
            <div className="inline-block border border-border px-2 py-0.5 mt-4">
              <span className="font-mono text-[10px] text-textMuted uppercase">LVL 3</span>
            </div>
          </div>

          {/* Heatmap */}
          <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-[2px]">
            {Array.from({ length: 182 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square w-2"
                style={{
                  backgroundColor: 
                    i % 13 === 0 ? "#111111" : 
                    i % 7 === 0 ? "#661010" : 
                    "#22c55e"
                }}
              />
            ))}
          </div>

          {/* Streak */}
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-[4px] text-textMuted uppercase mb-1">DAY STREAK</div>
            <div className="font-display font-extrabold text-5xl text-accentRed">34</div>
            <div className="font-mono text-[11px] text-textMuted mt-2 uppercase">BEST: 41 DAYS</div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="font-mono text-xs tracking-[4px] text-textMuted uppercase mb-4">
            START YOUR STREAK TODAY.
          </p>
          <Link
            href="/register"
            className="inline-block bg-accentRed text-white px-10 py-3.5 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-[#cc0000] transition-colors"
          >
            CLAIM YOUR SPOT
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 px-8 border-t border-border flex justify-between items-center">
        <div className="font-mono text-[10px] text-textMuted tracking-[3px] uppercase">
          © FIÈRTÉ
        </div>
        <div className="font-mono text-[10px] text-textMuted tracking-[3px] uppercase">
          NO EXCUSES.
        </div>
      </footer>
    </div>
  );
}
