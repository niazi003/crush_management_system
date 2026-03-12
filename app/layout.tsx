import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Crush Management System",
  description: "Track and manage crush dispatch records — dispatches, costs, revenue, and profit analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`} style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
        <div className="bg-pattern" />
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          {/* Header */}
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 40,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              background: "rgba(15, 13, 26, 0.8)",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <div
              style={{
                maxWidth: 1400,
                margin: "0 auto",
                padding: "0 24px",
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                  }}
                >
                  ⛏️
                </div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                    Crush Manager
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    Dispatch Tracking System
                  </div>
                </div>
              </a>
              <a href="/add" className="btn btn-primary btn-sm">
                <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
                New Dispatch
              </a>
            </div>
          </header>

          {/* Main Content */}
          <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
