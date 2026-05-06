"use client";

import { useEffect, useRef } from "react";
import { useOnboardingStore } from "@/lib/store/onboardingStore";
import GoalInput from "@/components/onboarding/GoalInput";
import HabitNegotiation from "@/components/onboarding/HabitNegotiation";
import ContractSeal from "@/components/onboarding/ContractSeal";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
  const { step, setStep, setProposedHabits, setIsThinking, setError } = useOnboardingStore();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const startNegotiation = (goal: string) => {
    const token = localStorage.getItem("fierté_token");
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
    const socket = new WebSocket(`${wsUrl}/ws/negotiate?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "goal", content: goal }));
      setStep(2);
      setIsThinking(true);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "thinking") {
        setIsThinking(true);
      } else if (message.type === "habits_proposal") {
        setIsThinking(false);
        setProposedHabits(message.content);
      } else if (message.type === "contract_sealed") {
        setStep(3);
      } else if (message.type === "error") {
        setError(message.content);
        setIsThinking(false);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error", error);
      setError("Connection lost. Try again.");
      setIsThinking(false);
    };
  };

  const handleAccept = (habits: any[]) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "accept", habits }));
    }
  };

  const handleRenegotiate = (habits: any[]) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "modify", habits }));
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[600px]"
          >
            <GoalInput onSubmit={startNegotiation} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[800px]"
          >
            <HabitNegotiation onAccept={handleAccept} onRenegotiate={handleRenegotiate} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <ContractSeal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
