"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ContractSeal() {
  const router = useRouter();
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    const flashTimeout = setTimeout(() => setShowFlash(false), 200);
    const redirectTimeout = setTimeout(() => router.push("/dashboard"), 2500);
    
    return () => {
      clearTimeout(flashTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-bgPrimary overflow-hidden">
      {showFlash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          className="fixed inset-0 bg-accentRed z-[100]"
        />
      )}

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="font-display font-black text-6xl md:text-9xl text-textPrimary uppercase text-center tracking-tighter"
      >
        CONTRACT SEALED.
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="font-mono text-textSecondary uppercase tracking-[6px] mt-8 text-center"
      >
        There are no excuses now.
      </motion.p>
    </div>
  );
}
