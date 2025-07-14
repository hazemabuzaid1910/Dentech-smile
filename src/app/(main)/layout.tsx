"use client";

import NavBar from "@/components/NavBar";
import NavSide from "@/components/NavSide";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <NavSide />
      <div className="flex flex-col flex-1 h-full">
        <NavBar />
        {children}
      </div>
    </div>
  );
}