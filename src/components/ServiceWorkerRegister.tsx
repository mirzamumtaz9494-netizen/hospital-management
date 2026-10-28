"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("VitalSync Offline Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("Service Worker registration failed:", err);
        });
    }
  }, []);

  return null;
};
