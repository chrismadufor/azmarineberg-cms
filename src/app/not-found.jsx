"use client"

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="mb-10 md:mb-16 text-5xl md:text:7xl xl:text-9xl font-semibold">404</h1>
        <p className="md:text-lg mb-5">Hi there! This page does not exist.</p>
        <Button color={"green"} text={"Go Back"} onClick={() => router.back()} />
    </div>
  );
}
