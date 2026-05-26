import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { CartSyncer } from "@/components/cart/CartSyncer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getBaseUrl,
  restaurantSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const DEFAULT_TITLE = "Wrapture · Hot shawarma & loaded fries in Asaba";
const DEFAULT_DESCRIPTION =
  "Wrapture — fresh-off-the-grill shawarma, suya and loaded fries delivered across Asaba in under 45 minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Wrapture",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Wrapture",
  authors: [{ name: "Wrapture", url: getBaseUrl() }],
  keywords: [
    "shawarma Asaba",
    "wraps Asaba",
    "food delivery Asaba",
    "loaded fries Asaba",
    "Wrapture",
    "Delta State food delivery",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    locale: "en_NG",
    siteName: "Wrapture",
    url: getBaseUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <JsonLd data={[restaurantSchema(), organizationSchema(), websiteSchema()]} />
      </head>
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <CartSyncer />
          {children}
          <WhatsAppFab />
          <Toaster theme="dark" position="bottom-right" />
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
