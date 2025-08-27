"use client";
import { useEffect } from "react";

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Remove injected class
    document.body.classList.remove("vsc-initialized");
  }, []);

  return <>{children}</>;
}
