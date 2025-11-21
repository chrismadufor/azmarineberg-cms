"use client";

import React from "react";

export default function DetailsBox({ label, children }) {
  return (
    <div className="mb-3">
      {label && (
        <p className="text-xs text-gray-500 mb-1">{label}</p>
      )}
      <div className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 min-h-[40px] flex items-center">
        {children || <span>—</span>}
      </div>
    </div>
  );
}
