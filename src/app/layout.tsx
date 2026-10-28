import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TenantProvider } from "@/context/TenantContext";
import { OfflineSyncProvider } from "@/context/OfflineSyncContext";
import { RoleProvider } from "@/context/RoleContext";
import { OwnerProvider } from "@/context/OwnerContext";
import { OwnerUnlockModal } from "@/components/superadmin/OwnerUnlockModal";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0c1322",
};

export const metadata: Metadata = {
  title: "VitalSync HMS | Modern Hospital Management System",
  description:
    "Next-generation Hospital Management & Clinical Operations Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VitalSync HMS",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
        <TenantProvider>
          <OfflineSyncProvider>
            <RoleProvider>
              <OwnerProvider>
                {children}
                <OwnerUnlockModal />
                <ServiceWorkerRegister />
                <Analytics />
              </OwnerProvider>
            </RoleProvider>
          </OfflineSyncProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
