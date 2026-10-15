import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0c1322",
};

export const metadata: Metadata = {
  title: "CarePulse HMS | Modern Hospital Management System",
  description:
    "Next-generation Hospital Management & Clinical Operations Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CarePulse HMS",
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
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}
