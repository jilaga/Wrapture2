import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

const PRIVATE_PATHS = [
  "/api/",
  "/account",
  "/addresses",
  "/orders",
  "/checkout",
  "/login",
  "/signup",
  "/track",
];

// AI search crawlers we explicitly allow so Wrapture can be cited by
// ChatGPT, Perplexity, Claude, Gemini and Copilot. Listing them is
// belt-and-braces — the `*` rule already allows them — but it documents
// intent and protects against future "block by default" config drift.
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
