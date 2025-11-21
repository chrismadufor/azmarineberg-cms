"use client";

import React, { useEffect } from "react";
import SideNav from "./SideNav";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ role, children }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.userProfile);

  useEffect(() => {
    if (!user) return;

    const hasAdminRole = Boolean(user?.role);

    if (hasAdminRole) {
      router.replace("/admin");
      return;
    } else {
      router.replace("/dashboard");
    }
  }, [role, router, user]);

  return (
    <div className="relative">
      <SideNav />
      <div className="pt-5 pb-20 px-3 md:px-5 xl:px-10 xl:ml-56 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
