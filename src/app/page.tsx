"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../app/(auth)/signin/AuthStore";

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    router.replace(token ? "/dashboard" : "/signin");
  }, [token, router]);

  return null;
}