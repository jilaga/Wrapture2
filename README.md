# Wrapture — Next.js full-stack rewrite

Next.js 16 + Tailwind v4 + Better Auth + Drizzle + Neon + Paystack + WhatsApp drop, deployable to Vercel one-shot.

## Stack

- **Framework**: Next.js 16 (App Router, RSC, Server Actions)
- **UI**: shadcn/ui (base-nova style, @base-ui/react) + Tailwind v4
- **Auth**: Better Auth (email/password + Google OAuth)
- **DB**: Neon Postgres + Drizzle ORM
- **Payments**: Paystack (NGN-native)
- **Orders**: WhatsApp Cloud API drop to owner number (no admin panel needed yet)
- **State**: Zustand (cart) — localStorage persist + server sync on auth
- **Animations**: framer-motion (scroll reveal) + CSS keyframes (smoke, marquee)
- **Analytics**: Vercel Analytics + Speed Insights + PostHog

## Local dev

```bash
pnpm install
cp .env.example .env
# Fill in DATABASE_URL + BETTER_AUTH_SECRET at minimum.
pnpm db:push   # apply Drizzle schema to Neon
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
   - `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OWNER_NUMBER`
   - `NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER`
   - `NEXT_PUBLIC_POSTHOG_KEY` (optional)
5. **Paystack webhook**: in Paystack Dashboard → Settings → Webhooks, set `{DEPLOY_URL}/api/paystack/webhook`.
6. Deploy. Done.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing — hero, menu, reviews, reels, footer |
| `/login`, `/signup` | Better Auth flows |
| `/account` | Profile (auth required) |
| `/addresses` | Saved delivery addresses CRUD |
| `/orders` | User order history |
| `/track?ref=...` | Public order tracker by reference |
| `/contact` | Contact info |
| `/faqs` | FAQs |
| `/checkout/callback` | Paystack post-payment landing |
| `/api/auth/[...all]` | Better Auth handler |
| `/api/paystack/webhook` | Paystack signature-verified webhook |

## Order flow

1. User adds items → zustand cart (localStorage).
2. Click Checkout → `checkoutAction` server action.
3. Server recomputes totals (anti-tamper), inserts `orders` row, calls Paystack init.
4. Redirect → Paystack-hosted payment page.
5. On success: Paystack → `/api/paystack/webhook` → mark `paid` → fire WhatsApp Cloud API to owner with formatted order.
6. User lands on `/checkout/callback?reference=...` → verify + show success.

If `PAYSTACK_SECRET_KEY` is missing (dev), checkout falls back to a `wa.me` deep link with the order pre-filled.

## Notes

- Animations from the old Vite project are properly wired now: scroll-reveal via framer-motion `useInView` on Menu/Reviews/Reels; the previously-defined-but-unused `marquee` is now wired to a ticker in the Reviews section; smoke + fade-up retained on hero.
- Old Lovable/Vite source: `../wrapture/` — kept untouched for reference.
