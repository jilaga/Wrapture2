import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { CartSyncer } from "@/components/cart/CartSyncer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Wrapture · Hot shawarma & loaded fries in Asaba",
  description:
    "Wrapture — fresh-off-the-grill shawarma, suya and loaded fries delivered across Asaba in under 45 minutes.",
  openGraph: {
    title: "Wrapture · Hot shawarma & loaded fries in Asaba",
    description:
      "Wrapture — fresh-off-the-grill shawarma, suya and loaded fries delivered across Asaba in under 45 minutes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wrapture · Hot shawarma & loaded fries in Asaba",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <CartSyncer />
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
