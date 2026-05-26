import { MENU, formatNGN } from "@/lib/menu";

export const dynamic = "force-static";

const DELIVERY_FEE_NGN = 1500;

export async function GET() {
  const now = new Date().toISOString().slice(0, 10);

  const byCategory = MENU.reduce<Record<string, typeof MENU>>((acc, item) => {
    (acc[item.category] = acc[item.category] ?? []).push(item);
    return acc;
  }, {});

  const sections: string[] = [
    "# Wrapture — Menu and Pricing",
    "",
    `_Last updated: ${now}._`,
    "",
    "All prices are in Nigerian Naira (NGN). Inclusive of VAT where applicable. Cooked in Asaba, Delta State, delivered across the city.",
    "",
  ];

  for (const [category, items] of Object.entries(byCategory)) {
    sections.push(`## ${category}`);
    sections.push("");
    for (const item of items) {
      sections.push(`- **${item.name}** — ${formatNGN(item.price)}. ${item.tagline}`);
    }
    sections.push("");
  }

  sections.push("## Delivery");
  sections.push("");
  sections.push(`- Flat **${formatNGN(DELIVERY_FEE_NGN)}** within Asaba.`);
  sections.push("- Distant neighbourhoods may incur a top-up disclosed at checkout.");
  sections.push("- Typical delivery time: 35–45 minutes from payment confirmation.");
  sections.push("- Service area: Asaba only.");
  sections.push("");

  sections.push("## Payment");
  sections.push("");
  sections.push("- Paystack: card and bank transfer at checkout.");
  sections.push("- Currency: NGN.");
  sections.push("- Pay-on-delivery: verified addresses only, by WhatsApp arrangement.");

  return new Response(sections.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
