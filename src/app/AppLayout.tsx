"use client";

import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";
import './globals.css'
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
    
        {children}
      
    </AuthProvider>
  );
}