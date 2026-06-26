"use client";

import { ReactNode } from "react";
import { UserModeProvider } from "@/app/context/UserModeContext";

export function Providers({ children }: { children: ReactNode }) {
  return <UserModeProvider>{children}</UserModeProvider>;
}
