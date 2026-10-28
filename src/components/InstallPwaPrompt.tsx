"use client";

import React, { useState, useEffect } from "react";
import { Download, Monitor, Smartphone, X, Sparkles, Share2 } from "lucide-react";

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Check if already running as standalone installed app (Desktop or Mobile)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    // 2. Detect mobile device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const mobileCheck = /iphone|ipad|ipod|android/i.test(userAgent);
    const iosCheck = /iphone|ipad|ipod/i.test(userAgent) && !(window as any).MSStream;

    setIsMobile(mobileCheck);
    setIsIos(iosCheck);

    // 3. Check if user previously dismissed in last 24h
    try {
      const dismissedUntil = localStorage.getItem("vitalsync_pwa_dismissed");
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        setIsDismissed(true);
      }
    } catch {}

    // 4. Capture native browser install prompt (Android Chrome & Desktop Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If iOS Safari, it doesn't fire beforeinstallprompt, but can be added to home screen
    if (iosCheck && !isStandalone) {
      setIsInstallable(true);
    }

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
      aria-label="Install App Notification"
      className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#0c1322] border border-teal-500/40 rounded-2xl shadow-2xl p-4 text-white animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
          {isMobile ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
            <span>
              {isMobile ? "Install VitalSync Mobile App" : "Install VitalSync Desktop App"}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded font-semibold border border-teal-500/30">
              PWA
            </span>
          </div>

          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
            {isIos ? (
              <span>
                To install on iPhone/iPad: Tap the <strong>Share button</strong>{" "}
                <Share2 className="inline w-3 h-3 text-teal-400" /> at the bottom of Safari and select{" "}
                <strong>&quot;Add to Home Screen&quot;</strong>.
              </span>
            ) : (
              <span>
                Install on your {isMobile ? "phone" : "PC"} for fast home screen launch, full offline data entry, and automatic cloud sync.
              </span>
            )}
          </p>

          {!isIos && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                {isMobile ? "Install App on Phone" : "Install Desktop App"}
              </button>
              <button
                onClick={handleDismiss}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition cursor-pointer"
              >
                Not now
              </button>
            </div>
          )}
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
