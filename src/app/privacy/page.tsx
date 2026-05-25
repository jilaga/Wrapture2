import Link from "next/link";
import type { Metadata } from "next";
import { PolicyShell, type PolicySection } from "@/components/legal/PolicyShell";

export const metadata: Metadata = {
  title: "Privacy Policy · Wrapture",
  description:
    "How Wrapture collects, uses and protects your personal data — written to comply with the Nigeria Data Protection Act 2023 and the NDPR 2019.",
};

const LAST_UPDATED = "25 May 2026";

const SECTIONS: PolicySection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <>
        <p>
          <strong>Wrapture</strong> is a food business operating from Asaba,
          Delta State, Nigeria. Under the Nigeria Data Protection Act 2023
          (&ldquo;NDPA&rdquo;) we are the <strong>data controller</strong> for
          the personal data described in this policy. Our processor for
          payments is Paystack Payments Limited.
        </p>
        <p>
          You can reach our data point of contact on the WhatsApp number
          listed on the <Link href="/contact">Contact page</Link>, or by email
          at <code>privacy@wrapture.ng</code> (placeholder).
        </p>
      </>
    ),
  },
  {
    id: "data-collected",
    heading: "What we collect",
    body: (
      <>
        <p>We only collect what we need to take and deliver your order:</p>
        <ul>
          <li>
            <strong>Identity &amp; contact:</strong> name, phone number, email,
            delivery address.
          </li>
          <li>
            <strong>Order data:</strong> items, quantities, totals, delivery
            notes, the 6-digit tracking number, status history.
          </li>
          <li>
            <strong>Payment metadata:</strong> Paystack reference and
            transaction ID. We do <em>not</em> see or store your card number,
            CVV, PIN, OTP or bank credentials — Paystack handles those under
            PCI-DSS.
          </li>
          <li>
            <strong>Communications:</strong> WhatsApp messages exchanged with
            our ops line in connection with your order (we log the inbound
            command, the staff number and our reply).
          </li>
          <li>
            <strong>Account data:</strong> the password hash if you create a
            password, or the linked Google account if you sign in with Google.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser, basic device
            info and limited cookies (see &sect; on cookies below).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "purposes",
    heading: "Why we use it",
    body: (
      <>
        <p>
          We process your data for the following purposes, on the
          corresponding legal bases under NDPA section 25:
        </p>
        <ul>
          <li>
            <strong>To fulfil your order</strong> — taking payment, preparing
            food, dispatching a rider, updating you over WhatsApp. Lawful
            basis: <em>performance of a contract</em>.
          </li>
          <li>
            <strong>To run our business</strong> — fraud prevention, refund
            handling, dispute resolution, basic analytics, tax records. Lawful
            basis: <em>legitimate interest</em>, balanced against your rights.
          </li>
          <li>
            <strong>To comply with the law</strong> — including the Cybercrime
            Act 2015 and tax legislation. Lawful basis:{" "}
            <em>legal obligation</em>.
          </li>
          <li>
            <strong>To send you marketing</strong> — only with your prior
            consent, and only if you opt in. You can withdraw consent at any
            time by replying STOP on WhatsApp or unsubscribing by email.
            Lawful basis: <em>consent</em>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    heading: "Who we share data with",
    body: (
      <>
        <p>
          We do <strong>not</strong> sell personal data. We share data only
          with the specific third parties needed to run the service:
        </p>
        <ul>
          <li>
            <strong>Paystack Payments Limited</strong> — for processing your
            payment. Paystack&apos;s own privacy notice applies to the data it
            handles directly: <code>paystack.com/privacy</code>.
          </li>
          <li>
            <strong>Meta Platforms, Inc.</strong> (WhatsApp Cloud API) — your
            phone number and the body of order-related WhatsApp messages.
            Subject to the WhatsApp Business Privacy Policy.
          </li>
          <li>
            <strong>Vercel Inc.</strong> — hosting the website and serverless
            functions. Logs IP addresses and request metadata for security.
          </li>
          <li>
            <strong>Neon Inc.</strong> — managed Postgres database that stores
            your orders, addresses and account data.
          </li>
          <li>
            <strong>Delivery riders</strong> — receive only the name,
            delivery address, phone number and tracking number needed to hand
            your order over.
          </li>
          <li>
            <strong>Authorities</strong> — when compelled by a valid court
            order, regulatory request or law-enforcement requirement under
            Nigerian law.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "transfers",
    heading: "International transfers",
    body: (
      <>
        <p>
          Our database is hosted in a Neon region inside the United States
          and our website infrastructure is hosted by Vercel, also a US-based
          provider. This means some of your personal data is transferred
          outside Nigeria.
        </p>
        <p>
          We rely on the NDPA section 41 transfer mechanisms — namely
          contractual safeguards with each processor and your informed consent
          when you place an order — to ensure these transfers are lawful and
          that your data receives an adequate level of protection.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep your data",
    body: (
      <>
        <ul>
          <li>
            <strong>Orders &amp; tracking history:</strong> kept for 6 years
            from the order date to meet Nigerian tax-record requirements.
          </li>
          <li>
            <strong>Customer account data:</strong> kept while your account is
            active. Deleted within 30 days of account closure, except where we
            must keep specific records to meet a legal obligation.
          </li>
          <li>
            <strong>WhatsApp inbound logs:</strong> kept for 90 days for
            dispute resolution, then deleted.
          </li>
          <li>
            <strong>Marketing consents:</strong> kept until you withdraw them,
            plus 12 months as proof of consent.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights under the NDPA",
    body: (
      <>
        <p>
          As a data subject under the Nigeria Data Protection Act 2023, you
          have the right to:
        </p>
        <ul>
          <li>
            <strong>be informed</strong> about what we do with your data (this
            page);
          </li>
          <li>
            <strong>access</strong> the personal data we hold about you;
          </li>
          <li>
            <strong>rectify</strong> data that is wrong or incomplete;
          </li>
          <li>
            <strong>erase</strong> your data (the &ldquo;right to be
            forgotten&rdquo;), subject to retention obligations above;
          </li>
          <li>
            <strong>restrict</strong> or <strong>object to</strong> processing
            that we base on legitimate interest;
          </li>
          <li>
            <strong>data portability</strong> — receive a machine-readable
            copy of the data you have given us;
          </li>
          <li>
            <strong>withdraw consent</strong> at any time, without affecting
            processing that took place before withdrawal;
          </li>
          <li>
            <strong>lodge a complaint</strong> with the Nigeria Data
            Protection Commission (NDPC) — <code>ndpc.gov.ng</code>.
          </li>
        </ul>
        <p>
          To exercise any of these rights, WhatsApp us with the request and
          your order reference. We respond within 30 days as required by the
          NDPA.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies and similar technologies",
    body: (
      <>
        <p>
          The site uses a minimum of cookies and similar storage to work
          correctly. We do not use advertising cookies or third-party tracking
          beacons.
        </p>
        <ul>
          <li>
            <strong>Strictly necessary:</strong> a session cookie set by
            Better Auth to keep you signed in, and a small amount of
            localStorage that remembers what is in your cart between page
            loads. Cannot be turned off without breaking the site.
          </li>
          <li>
            <strong>Analytics (optional):</strong> if you opt in, PostHog
            captures anonymous pageviews and the events <code>add_to_cart</code>,
            <code> checkout_start </code> and <code>order_placed</code> to help
            us improve the menu and the flow. You can opt out at any time —
            see the cookie banner.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <>
        <p>
          Wrapture is intended for adults. We do not knowingly collect
          personal data from anyone under the age of 18. If you are a parent
          or guardian and believe your child has placed an order or supplied
          us with personal data, WhatsApp us and we will delete the data and
          cancel the order.
        </p>
      </>
    ),
  },
  {
    id: "security",
    heading: "Security",
    body: (
      <>
        <p>
          We protect your data with industry-standard measures:
        </p>
        <ul>
          <li>HTTPS / TLS on every page and API endpoint;</li>
          <li>encrypted passwords (hashed with a modern algorithm — never stored in plain text);</li>
          <li>signed webhooks for Paystack so we know payment events are genuine;</li>
          <li>staff-allowlisted WhatsApp ops line so only known numbers can change order status;</li>
          <li>least-privilege database access via a managed Postgres host.</li>
        </ul>
        <p>
          No system is perfectly secure. If a breach affects your personal
          data we will notify the NDPC within 72 hours of becoming aware of
          it, and notify you directly without undue delay where the breach is
          likely to result in high risk to your rights — as required by NDPA
          section 40.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <>
        <p>
          We may update this policy as the service evolves. The current
          version is always at this URL and the &ldquo;Last updated&rdquo; date
          at the top tracks the change. We will draw your attention to
          material changes the next time you visit checkout.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    heading: "Contact and complaints",
    body: (
      <>
        <p>
          For any data-protection question, complaint or request, WhatsApp
          our ops line or email <code>privacy@wrapture.ng</code>. If you are
          not satisfied with how we respond you may complain to the Nigeria
          Data Protection Commission directly — <code>ndpc.gov.ng</code>.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PolicyShell
      eyebrow="Legal · NDPA 2023"
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          We only collect what we need to take your order, deliver it, and
          deal with any problem afterwards. We never sell your data. You can
          ask for a copy, correction or deletion at any time. Full detail
          below.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
