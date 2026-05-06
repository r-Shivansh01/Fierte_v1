"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";
import { User } from "@/lib/types";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("fierté_token") : null;
        
        if (!token) {
          if (!isPublicRoute) {
            router.push("/");
          }
          setIsLoading(false);
          return;
        }

        try {
          const { data: user } = await api.get<User>("/auth/me");
          
          if (isPublicRoute) {
            if (user.is_onboarded) {
              router.push("/dashboard");
            } else {
              router.push("/onboarding");
            }
          }
        } catch (error) {
          if (!isPublicRoute) {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, isPublicRoute]);

  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgPrimary">
        <div className="font-mono text-textMuted animate-pulse tracking-widest uppercase">
          INITIALIZING SYSTEM...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
