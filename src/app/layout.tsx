import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SprintOps - AI Technical Product Manager",
  description: "Autonomous bug triage, spec generation, and daily standups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
