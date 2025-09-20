import React from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative">
      <TopNav />
      <SideNav />
      <div className="py-20 px-3 md:px-5 xl:px-10 xl:ml-56 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
