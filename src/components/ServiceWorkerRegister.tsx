"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("VitalSync Offline Service Worker registered:", reg.scope);
          // Check for service worker updates immediately on page load
          reg.update().catch(() => {});

          reg.onupdatefound = () => {
            const installing = reg.installing;
            if (installing) {
              installing.onstatechange = () => {
                if (installing.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("VitalSync Offline cache updated to latest version.");
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn("Service Worker registration failed:", err);
        });

      // Warm up offline cache for key routes in background when online
      if (navigator.onLine) {
        const warmRoutes = ["/", "/opd", "/ipd", "/accounts"];
        warmRoutes.forEach((route) => {
          fetch(route, { cache: "force-cache" }).catch(() => {});
        });
      }
    }
  }, []);

  return null;
};
