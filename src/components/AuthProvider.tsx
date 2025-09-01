"use client";

import { ReactNode, useEffect, useState } from "react";
import useAuthStore from "../app/store/AuthStore";
import { usePathname, useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated, initializeAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  localStorage.clear()
  useEffect(() => {
    // 1. تهيئة حالة المصادقة أولاً
    initializeAuth();
  }, []);

  useEffect(() => {
    // 2. هذا التأثير يعمل بعد أن تكون الحالة قد تهيأت

    const isAuthPage = ["/signin", "/forgetpassword"].includes(pathname);
    const isRootPage = pathname === "/";

    console.log("Auth Status:", {
      token,
      isAuthenticated,
      pathname,
      shouldRedirect: token && (isAuthPage || isRootPage)
    });

    if (token) {
      if (isAuthPage || isRootPage) {
        router.replace("/dashboard");
        return;
      }
    } else {
      if (!isAuthPage) {
        router.replace("/signin");
        return;
      }
    }

    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [token, isAuthenticated, pathname, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}