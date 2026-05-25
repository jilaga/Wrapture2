# Wrapture — Next.js full-stack rewrite

Next.js 16 + Tailwind v4 + Better Auth + Drizzle + Neon + Paystack + WhatsApp drop, deployable to Vercel one-shot.

## Stack

- **Framework**: Next.js 16 (App Router, RSC, Server Actions)
- **UI**: shadcn/ui (base-nova style, @base-ui/react) + Tailwind v4
- **Auth**: Better Auth (email/password + Google OAuth)
- **DB**: Neon Postgres + Drizzle ORM
- **Payments**: Paystack hosted checkout (NGN-native); simulated payment page in dev
- **Orders**: WhatsApp Cloud API drop to owner number; `wa.me` deep-link fallback
- **State**: Zustand cart — localStorage persist + server `server_cart` sync on auth
- **Animations**: framer-motion scroll-reveal + CSS keyframes (smoke, marquee)
- **Analytics**: Vercel Analytics + Speed Insights + PostHog

## Local dev

```bash
pnpm install
cp .env.example .env.local
# Fill in DATABASE_URL + BETTER_AUTH_SECRET at minimum.
pnpm db:push    # apply Drizzle schema to Neon
pnpm db:seed    # optional: populate the test user with sample orders/addresses
pnpm dev
```

## Deploy to Vercel

1. Push to GitHub.
2. `vercel link` (or import in dashboard).
3. Provision **Neon Postgres** via Vercel Marketplace → auto-injects `DATABASE_URL`.
4. Add remaining env vars in Project Settings:
   - `BETTER_AUTH_SECRET` (run `openssl rand -base64 32`)
   - `BETTER_AUTH_URL` (your production https URL)
   - `NEXT_PUBLIC_APP_URL` (same)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (optional)
   - `PAYSTACK_SECRET_KEY`
   - `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OWNER_NUMBER`
   - `NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER`
   - `NEXT_PUBLIC_POSTHOG_KEY` (optional)
5. **Paystack webhook**: in Paystack Dashboard → Settings → Webhooks, set `{DEPLOY_URL}/api/paystack/webhook`.
6. Deploy. Done.

See [`KEYS.md`](./KEYS.md) for step-by-step instructions on obtaining each optional service key.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing — hero, menu, reviews, reels, footer |
| `/login`, `/signup` | Better Auth flows (optional; checkout auto-creates accounts) |
| `/account` | Profile |
| `/addresses` | Saved delivery addresses CRUD |
| `/orders` | User order history |
| `/orders/[ref]` | Order tracking with visual status timeline |
| `/track?ref=...` | Public order tracker by reference |
| `/contact` | Contact info |
| `/faqs` | FAQs |
| `/checkout/simulate/[ref]` | Simulated Paystack page (dev only — used when `PAYSTACK_SECRET_KEY` is missing) |
| `/checkout/callback` | Real Paystack post-payment verification |
| `/api/auth/[...all]` | Better Auth handler |
| `/api/paystack/webhook` | Paystack signature-verified webhook |

## Order flow (guest-first, account auto-created at checkout)

1. User adds items → zustand cart (localStorage).
2. Click Checkout → unified form collects delivery address, name, email, phone (+ "remember this address" checkbox).
3. `checkoutAction` recomputes totals server-side, creates a user via Better Auth with a server-side random password if no session, inserts the order, returns either the real Paystack `authorization_url` or a simulated checkout URL.
4. User pays → on success the order is marked `paid`, the WhatsApp Cloud API fires a formatted message to the owner number silently, then the user lands on `/orders?placed=<ref>` with a success banner.
5. Status progresses through `paid → preparing → out_for_delivery → delivered`, visible on `/orders/[ref]` as a vertical timeline with per-stage timestamps.

In development (no Paystack key configured), a faithful Paystack-style page at `/checkout/simulate/[ref]` lets you confirm or cancel the payment so the rest of the flow can be exercised. A dev-only "Advance status" button on `/orders/[ref]` lets you walk an order through each stage without an admin panel.

## Notes

- Animations: scroll-reveal via framer-motion `useInView` on Menu/Reviews/Reels; the `marquee` keyframe is wired to a ticker in the Reviews section; smoke + fade-up retained on hero.
- Old Lovable/Vite source lives at `../wrapture/` and is kept untouched for reference.
