"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRole } from "./RoleContext";

interface OwnerContextValue {
  isOwner: boolean;
  unlockOwner: (passkey: string) => boolean;
  lockOwner: () => void;
  isUnlockModalOpen: boolean;
  openUnlockModal: () => void;
  closeUnlockModal: () => void;
}

const OwnerContext = createContext<OwnerContextValue | undefined>(undefined);

const OWNER_STORAGE_KEY = "vitalsync_platform_owner_session_v1";

// Master passkeys accepted for Owner verification
const ACCEPTED_PASSKEYS = [
  "Owner@2026",
  "MZS@Owner2026",
  "Hospital@2026",
  "Admin@2026",
];

export const OwnerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const { currentRole } = useRole();

  // Load persisted owner session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(OWNER_STORAGE_KEY);
      if (saved === "true" || saved === "unlocked") {
        setIsOwner(true);
      }
    } catch {}
  }, []);

  // Listen for secret keyboard shortcut: Ctrl + Shift + S or Ctrl + Shift + O
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s" || e.key === "O" || e.key === "o")) {
        e.preventDefault();
        setIsUnlockModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const unlockOwner = (passkey: string): boolean => {
    const cleanKey = passkey.trim();
    const envKey = process.env.NEXT_PUBLIC_OWNER_PASSKEY;

    if (
      ACCEPTED_PASSKEYS.includes(cleanKey) ||
      (envKey && cleanKey === envKey)
    ) {
      setIsOwner(true);
      try {
        localStorage.setItem(OWNER_STORAGE_KEY, "true");
      } catch {}
      return true;
    }
    return false;
  };

  const lockOwner = () => {
    setIsOwner(false);
    try {
      localStorage.removeItem(OWNER_STORAGE_KEY);
    } catch {}
  };

  const openUnlockModal = () => setIsUnlockModalOpen(true);
  const closeUnlockModal = () => setIsUnlockModalOpen(false);

  return (
    <OwnerContext.Provider
      value={{
        isOwner,
        unlockOwner,
        lockOwner,
        isUnlockModalOpen,
        openUnlockModal,
        closeUnlockModal,
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = (): OwnerContextValue => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useOwner must be used within an OwnerProvider");
  }
  return context;
};
