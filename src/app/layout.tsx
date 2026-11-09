import type { Metadata } from "next";
import { Providers } from "@/components/shared/providers";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from "@/components/shared/splash-screen";
import "./globals.css";

export const metadata: Metadata = {
  title: "QELVANTA — Work smarter. Grow faster.",
  description:
    "An intelligent, all-in-one business management platform that helps businesses manage their operations, finances, customers, teams and growth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <SplashScreen />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}