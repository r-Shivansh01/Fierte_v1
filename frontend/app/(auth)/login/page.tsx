"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { AuthResponse } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const { data } = await api.post<AuthResponse>("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("fierté_token", data.access_token);
      
      if (data.user.is_onboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch (err: any) {
      setError("Wrong credentials. Try again.");
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
          ENTER
        </h1>

        <div className="space-y-4">
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
            {isLoading ? "AUTHENTICATING..." : "ENTER"}
          </button>

          <div className="text-center mt-6">
            <Link
              href="/register"
              className="font-mono text-[10px] text-textSecondary hover:text-textPrimary transition-colors tracking-[2px] uppercase"
            >
              No account. Create one.
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
