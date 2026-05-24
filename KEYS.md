# Wrapture — third-party keys

Step-by-step on getting each optional service key, where to paste it, and what unlocks once it's set.

You can either:
- **Self-serve**: follow each section and paste the values into the Vercel dashboard, then run `vercel env pull .env.local --yes` to refresh local.
- **Paste to me**: drop the values in chat and I'll write them to Vercel + sync locally. **Never paste secrets in a public channel.** Direct chat with me is fine; if you're worried, generate _test_ keys first (most services have test vs live).

---

## 1. Paystack — payments

**What it unlocks:** real card / bank-transfer / USSD payments in NGN at checkout. Without it, checkout falls back to a `wa.me` deep link with the order pre-filled.

### Get the keys

1. Go to https://dashboard.paystack.com and sign up (free, no KYC required for test mode).
2. Once in: **Settings** (sidebar) → **API Keys & Webhooks**.
3. You'll see two pairs of keys at the top:
   - **Test secret key** — starts with `sk_test_…`
   - **Test public key** — starts with `pk_test_…`
4. Switch to **Live** mode (top-right toggle) only after you've completed business verification (KYC: BVN, business reg, bank account). Live keys start with `sk_live_…` / `pk_live_…`.

### Where to paste

| Key | Env var | Visible to client? |
|---|---|---|
| `sk_test_…` / `sk_live_…` | `PAYSTACK_SECRET_KEY` | ❌ Server only |
| `pk_test_…` / `pk_live_…` | `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | ✅ Public (bundled in client) |

### Webhook setup (required)

In Paystack dashboard → **Settings** → **API Keys & Webhooks** → **Webhook URL**:

```
https://<your-vercel-url>/api/paystack/webhook
```

Paystack signs every event with HMAC-SHA512 using your secret. Our `/api/paystack/webhook` handler verifies this signature before mutating the order.

For local testing, use the [Paystack CLI tunnel](https://paystack.com/docs/payments/test-payments/#using-the-paystack-cli) or ngrok to expose `localhost:3030`.

### Test cards

Use `4084 0840 8408 4081` (CVV `408`, expiry any future date, PIN `0000`, OTP `123456`) in test mode.

---

## 2. Google OAuth — "Continue with Google" sign-in

**What it unlocks:** the **Continue with Google** button on `/login` and `/signup`. Without it, only email/password works.

### Get the keys

1. Go to https://console.cloud.google.com.
2. Create a project (or pick one): top bar → project dropdown → **New Project** → name it "Wrapture".
3. Configure OAuth consent screen first (one-time per project):
   - Left sidebar → **APIs & Services** → **OAuth consent screen**.
   - User type: **External**. Submit.
   - App name: "Wrapture". User support email: yours. Developer contact: yours.
   - Scopes: skip (defaults are fine).
   - Test users: add your own email (until you verify the app, only test users can log in).
4. Create credentials:
   - Left sidebar → **APIs & Services** → **Credentials** → **+ Create Credentials** → **OAuth client ID**.
   - Application type: **Web application**.
   - Name: "Wrapture Web".
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3030
     https://<your-vercel-url>
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3030/api/auth/callback/google
     https://<your-vercel-url>/api/auth/callback/google
     ```
   - Click **Create**.
5. A modal pops up with your **Client ID** and **Client Secret**. Copy both.

### Where to paste

| Key | Env var |
|---|---|
| Client ID | `GOOGLE_CLIENT_ID` |
| Client Secret | `GOOGLE_CLIENT_SECRET` |

---

## 3. PostHog — product analytics

**What it unlocks:** pageview tracking + event capture (`add_to_cart`, `checkout_start`, `order_placed`) for understanding user behavior. Without it, the provider is a no-op.

### Get the key

1. Go to https://posthog.com and sign up (free tier covers most early traffic).
2. Pick **US Cloud** (recommended) or **EU Cloud** during onboarding.
3. After project creation, you'll see a code snippet with your **Project API key**. It looks like `phc_abc123…`.
4. The **host** for US Cloud is `https://us.i.posthog.com`. For EU it's `https://eu.i.posthog.com`.

### Where to paste

| Key | Env var | Visible to client? |
|---|---|---|
| `phc_…` | `NEXT_PUBLIC_POSTHOG_KEY` | ✅ Public |
| `https://us.i.posthog.com` | `NEXT_PUBLIC_POSTHOG_HOST` | ✅ Public |

---

## 4. WhatsApp Cloud API — owner order drops

**What it unlocks:** automatic WhatsApp messages to the owner number every time an order is paid. Without it, the order is still saved to the DB, but you'd check `/orders` (admin view doesn't exist yet) or wait for the customer's `wa.me` fallback message.

This is the **most involved** setup. If you want to skip for now, the `wa.me` fallback (which opens WhatsApp in the customer's browser with the order pre-filled and sends it to your owner number) covers MVP.

### Get the keys

1. Go to https://developers.facebook.com → **My Apps** → **Create app** → use case "Other" → app type **Business**.
2. App name: "Wrapture WhatsApp Drop". Business account: create one or pick existing.
3. Once created, in the left sidebar, click **WhatsApp** under "Add products to your app" → **Set up**.
4. Meta gives you a **test phone number** for free (good for dev). For production, you'll need to add your own business phone (cannot be a personal-WhatsApp number).
5. From the **WhatsApp → API Setup** page:
   - Copy the **Phone number ID** (a numeric string).
   - Copy the **Temporary access token** (24-hour lifespan — only good for testing). For a permanent token, follow [Meta's system user docs](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started).
   - Add your own WhatsApp number as a recipient in the "To" dropdown so Meta will deliver test messages to it.

### Where to paste

| Key | Env var |
|---|---|
| Phone number ID | `WHATSAPP_PHONE_NUMBER_ID` |
| Temporary or permanent access token | `WHATSAPP_TOKEN` |
| Your owner number, E.164 (e.g. `+2348012345678`) | `WHATSAPP_OWNER_NUMBER` |
| Same number, public-safe variant | `NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER` |

`NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER` is used for the **Contact** page CTA and the `wa.me` fallback link. The non-public `WHATSAPP_OWNER_NUMBER` is what the server uses when calling Meta's Cloud API.

---

## How to paste into Vercel + local

### Option A — Vercel dashboard (recommended for production)

1. Go to https://vercel.com/aviofla/wrapture/settings/environment-variables (or your project URL).
2. **Add** for each var. Pick which environments it applies to (Production / Preview / Development).
3. Once added, run locally:
   ```bash
   vercel env pull .env.local --yes
   ```
4. Restart dev: `pnpm dev`.

### Option B — Vercel CLI

```bash
# Production + preview + development for a single var
echo "sk_test_xxx" | vercel env add PAYSTACK_SECRET_KEY production
echo "sk_test_xxx" | vercel env add PAYSTACK_SECRET_KEY preview
echo "sk_test_xxx" | vercel env add PAYSTACK_SECRET_KEY development
vercel env pull .env.local --yes
```

### Option C — paste in chat to me

Drop the key + which var it's for. I'll push to all three Vercel environments and pull locally. Test keys preferred over live (less risk if a key gets exposed).

---

## What's already set vs. missing

Quick check from any local terminal:

```bash
comm -23 \
  <(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' .env.example | cut -d '=' -f 1 | sort -u) \
  <(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' .env.local   | cut -d '=' -f 1 | sort -u)
```

Anything that prints is missing. As of the last bootstrap, the missing list was:

```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
NEXT_PUBLIC_POSTHOG_HOST
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER
PAYSTACK_SECRET_KEY
WHATSAPP_OWNER_NUMBER
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_TOKEN
```

All optional — the app runs without them with graceful degradation.

---

## Priority for going live

If you want to go live in stages:

1. **Paystack first** — without it, you can't actually take money. Test keys for staging, live keys after KYC for production.
2. **WhatsApp second** — so you actually see incoming orders without staring at the DB. Test phone number is fine to start.
3. **PostHog third** — analytics for understanding usage patterns once traffic is real.
4. **Google OAuth last** — nice-to-have. The guest-first checkout flow doesn't need it; email/password (or no-password via checkout) covers everything.
