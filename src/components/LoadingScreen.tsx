// components/PageTransitionLoader.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // يمكنك استخدام Events الخاصة بـ Next.js إذا كانت متاحة
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
      <div className="w-12 h-12 border-t-2 border-b-2 border-[var(--main-color)] rounded-full animate-spin"></div>
    </div>
  );
}