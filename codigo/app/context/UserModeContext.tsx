"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserMode } from "@/lib/types";

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(
  undefined
);

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UserMode>("citizen");

  return (
    <UserModeContext.Provider value={{ mode, setMode }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error("useUserMode must be used within a UserModeProvider");
  }
  return context;
}
