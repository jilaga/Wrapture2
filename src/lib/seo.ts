// Canonical site URL — read at build time. Order of preference:
//  1. NEXT_PUBLIC_APP_URL (set in Vercel + .env.local)
//  2. Vercel's auto-injected production URL
//  3. Hard-coded fallback so dev never crashes
export function getBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "https://wrapture.ng";
}

const SOCIAL_PROFILES = [
  "https://instagram.com/wrapture",
  "https://tiktok.com/@wrapture",
  "https://x.com/wrapture",
  "https://facebook.com/wrapture",
];

import { MENU } from "@/lib/menu";

export function restaurantSchema() {
  const base = getBaseUrl();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER ?? "";

  const menuItems = MENU.map((item) => ({
    "@type": "MenuItem",
    name: item.name,
    description: item.tagline,
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "NGN",
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${base}#restaurant`,
    name: "Wrapture",
    url: base,
    description:
      "Wrapture — hot shawarma, signature wraps and loaded fries, delivered across Asaba in under 45 minutes.",
    image: [`${base}/opengraph-image`],
    ...(phone ? { telephone: phone } : {}),
    priceRange: "₦₦",
    servesCuisine: ["Nigerian", "Middle Eastern", "Fast Food"],
    acceptsReservations: false,
    paymentAccepted: ["Card", "Bank Transfer"],
    currenciesAccepted: "NGN",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Asaba",
      addressRegion: "Delta",
      addressCountry: "NG",
    },
    // Asaba CBD approximate centroid. Replace with the kitchen's real
    // coordinates once the lease is finalised — Google uses this for the
    // map pin and for distance ranking in "near me" queries.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.198,
      longitude: 6.731,
    },
    areaServed: {
      "@type": "City",
      name: "Asaba",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Delta State",
      },
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "23:00",
      },
    ],
    hasMenu: {
      "@type": "Menu",
      name: "Wrapture menu",
      url: `${base}/#menu`,
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Menu",
          hasMenuItem: menuItems,
        },
      ],
    },
    // Uncomment once Wrapture has 10+ real Google reviews:
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: "4.8",
    //   reviewCount: "120",
    // },
    sameAs: SOCIAL_PROFILES,
  };
}

export function organizationSchema() {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}#organization`,
    name: "Wrapture",
    url: base,
    logo: `${base}/icon.png`,
    sameAs: SOCIAL_PROFILES,
  };
}

export function websiteSchema() {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}#website`,
    url: base,
    name: "Wrapture",
    publisher: { "@id": `${base}#organization` },
    inLanguage: "en-NG",
  };
}
