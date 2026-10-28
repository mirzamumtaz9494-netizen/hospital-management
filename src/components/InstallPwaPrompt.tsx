"use client";

import React, { useState, useEffect } from "react";
import { Download, Monitor, X, Sparkles, CheckCircle2 } from "lucide-react";

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as standalone desktop app
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    // Check if user previously dismissed today
    try {
      const dismissedUntil = localStorage.getItem("vitalsync_pwa_dismissed");
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        setIsDismissed(true);
      }
    } catch {}

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      // Dismiss for 24 hours
      localStorage.setItem(
        "vitalsync_pwa_dismissed",
        String(Date.now() + 24 * 60 * 60 * 1000)
      );
    } catch {}
  };

  if (!isInstallable || isDismissed || isStandalone) {
    return null;
  }

  return (
    <aside
      aria-label="Install Desktop App Notification"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#0c1322] border border-teal-500/40 rounded-2xl shadow-2xl p-4 text-white animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
          <Monitor className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
            <span>Install VitalSync Desktop App</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded font-semibold border border-teal-500/30">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
            Install on this PC for direct Windows Desktop launch, faster caching, and automatic offline data protection.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              Install Desktop App
            </button>
            <button
              onClick={handleDismiss}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition cursor-pointer"
            >
              Not now
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
