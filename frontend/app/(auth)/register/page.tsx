"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { AuthResponse } from "@/lib/types";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post<AuthResponse>("/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("fierté_token", data.access_token);

      // Sync with next-auth
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/onboarding");
    } catch (err: any) {
...
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Invalid input");
      } else {
        setError(detail || "Registration failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px]"
      >
        <h1 className="font-display font-black text-4xl text-textPrimary uppercase mb-8 text-center tracking-tighter">
          CLAIM YOUR SPOT
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-b border-border py-3 px-1 font-mono text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-textSecondary transition-colors"
          />
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-border py-3 px-1 font-mono text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-textSecondary transition-colors"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-border py-3 px-1 font-mono text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-textSecondary transition-colors"
          />

          {error && (
            <p className="text-accentRed font-mono text-[10px] tracking-widest uppercase mt-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-accentRed text-white py-4 font-mono text-xs font-bold tracking-[4px] uppercase hover:bg-[#cc0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? "CREATING ACCOUNT..." : "CLAIM YOUR SPOT"}
          </button>

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="font-mono text-[10px] text-textSecondary hover:text-textPrimary transition-colors tracking-[2px] uppercase"
            >
              Already registered. Enter.
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
