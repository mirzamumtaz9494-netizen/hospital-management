import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarePulse HMS | Modern Hospital Management System",
  description: "Next-generation Hospital Management & Clinical Operations Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
