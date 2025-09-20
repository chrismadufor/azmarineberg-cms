"use client"

import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/login") 
  }, [])

  return (
   <div className="min-h-screen flex flex-col gap-5 items-center justify-center">
    <p className="text-3xl font-semibold">Azmarineberg CMS</p>
    <Spinner />
   </div>
  );
}
