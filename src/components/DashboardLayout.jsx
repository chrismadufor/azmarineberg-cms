"use client";

import React, { useEffect } from "react";
import SideNav from "./SideNav";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ role, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.userProfile);

  useEffect(() => {
    if (!user) return;

    const hasAdminRole = Boolean(user?.role);
    const currentPath = pathname || "";

    // Only redirect if user is not already on the correct page
    if (hasAdminRole && !currentPath.startsWith("/admin")) {
      router.replace("/admin");
      return;
    } else if (!hasAdminRole && !currentPath.startsWith("/dashboard")) {
      router.replace("/dashboard");
    }
  }, [role, router, user, pathname]);

  return (
    <div className="relative">
      <SideNav />
      <div className="pt-5 pb-20 px-3 md:px-5 xl:px-10 xl:ml-56 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
