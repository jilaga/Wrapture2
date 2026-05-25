import Link from "next/link";
import type { Metadata } from "next";
import { PolicyShell, type PolicySection } from "@/components/legal/PolicyShell";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy · Wrapture",
  description:
    "When Wrapture refunds, replaces or credits an order, and how long the money takes to reach you.",
};

const LAST_UPDATED = "25 May 2026";

const SECTIONS: PolicySection[] = [
  {
    id: "principle",
    heading: "Our principle",
    body: (
      <>
        <p>
          We&apos;d rather make it right than argue. If we cooked it wrong or
          never delivered it, you get your money back. If your case sits in
          the middle, we&apos;ll usually offer a re-make or store credit. Any
          decision we make is consistent with your statutory rights under the
          Federal Competition and Consumer Protection Act 2018.
        </p>
      </>
    ),
  },
  {
    id: "full-refund",
    heading: "When you get a full refund",
    body: (
      <>
        <p>You get 100% of what you paid back when:</p>
        <ul>
          <li>your order never arrives;</li>
          <li>we cancel the order ourselves (out of stock, kitchen issue, payment failure);</li>
          <li>the food is genuinely unsafe — visible spoilage, foreign object, undercooked protein — and you tell us within <strong>2 hours</strong> of delivery with a photo or video sent to our WhatsApp line;</li>
          <li>the wrong order is delivered and you decline the substitute.</li>
        </ul>
      </>
    ),
  },
  {
    id: "partial",
    heading: "When you get a partial refund, re-make or credit",
    body: (
      <>
        <p>
          For complaints that don&apos;t rise to &ldquo;unsafe&rdquo; — wrap
          short on filling, missing a side item, sauce on the side instead of
          inside, etc. — we typically offer one of:
        </p>
        <ul>
          <li>a partial refund (the item value, not the full order);</li>
          <li>a free re-make of the affected item on your next order;</li>
          <li>store credit equal to the affected item value.</li>
        </ul>
        <p>
          You pick which option you&apos;d prefer when you message us. Where
          law gives you a stronger right than this policy, the stronger right
          applies.
        </p>
      </>
    ),
  },
  {
    id: "no-refund",
    heading: "When we won&apos;t refund",
    body: (
      <>
        <p>We do not refund when:</p>
        <ul>
          <li>the order was delivered correctly and you simply changed your mind after dispatch;</li>
          <li>you gave us a wrong or incomplete address and the rider could not reach you within the agreed wait time;</li>
          <li>nobody answered the phone or the gate after the rider waited 10 minutes at the confirmed address;</li>
          <li>the order was correct and edible but you did not enjoy a particular flavour;</li>
          <li>you do not contact us within 24 hours of delivery (for cosmetic complaints) or 2 hours (for unsafe-food complaints).</li>
        </ul>
        <p>
          These limits exist so we can investigate while the food, the
          rider&apos;s trip and the kitchen&apos;s memory are still fresh. They
          do not override your statutory consumer rights.
        </p>
      </>
    ),
  },
  {
    id: "how-to-request",
    heading: "How to ask for a refund",
    body: (
      <>
        <p>WhatsApp our ops line and include:</p>
        <ul>
          <li>your 6-digit tracking number (the same one you used to track the order);</li>
          <li>a one-sentence description of what went wrong;</li>
          <li>a photo or short video if it&apos;s a quality or safety issue — this dramatically speeds things up.</li>
        </ul>
        <p>
          You can also raise the issue from the order page on the website by
          using the <em>Contact us about this order</em> link once it ships.
        </p>
      </>
    ),
  },
  {
    id: "timing",
    heading: "How quickly you get the money",
    body: (
      <>
        <ul>
          <li>
            <strong>Decision:</strong> we reply within 24 hours of receiving
            your request — usually much faster during open hours.
          </li>
          <li>
            <strong>Reversal initiation:</strong> within 1 business day of
            agreeing on a refund.
          </li>
          <li>
            <strong>Money in your account:</strong> 1&ndash;7 business days
            depending on your card issuer or bank. Paystack typically reverses
            card transactions within 5 business days; bank transfers are
            usually faster.
          </li>
        </ul>
        <p>
          Store credit appears against your account immediately and never
          expires.
        </p>
      </>
    ),
  },
  {
    id: "chargebacks",
    heading: "Chargebacks",
    body: (
      <>
        <p>
          We&apos;d much rather fix the problem directly than have you file a
          chargeback through your bank. If you do file one before raising the
          issue with us, Paystack will freeze the disputed funds and we lose
          the ability to make it right quickly. If the chargeback is later
          determined to be unjustified, we may refuse future orders from the
          same account or payment method.
        </p>
      </>
    ),
  },
  {
    id: "customer-cancellation",
    heading: "Cancellation by you",
    body: (
      <>
        <p>
          You can cancel an order without giving any reason while the status
          is still <em>Awaiting payment</em> or <em>Paid</em>. Once the
          kitchen marks the order <strong>Accepted</strong>, food preparation
          has started and the cancellation moves into refund territory — see
          above.
        </p>
      </>
    ),
  },
  {
    id: "wrapture-cancellation",
    heading: "Cancellation by Wrapture",
    body: (
      <>
        <p>We may cancel an order before delivery if:</p>
        <ul>
          <li>an ingredient runs out and no substitute is acceptable;</li>
          <li>payment fails or Paystack flags the transaction;</li>
          <li>the address is outside our service area or we cannot safely reach it;</li>
          <li>we reasonably suspect fraud or abuse.</li>
        </ul>
        <p>
          In every such case the full amount you paid is refunded under the
          timing rules above. We will WhatsApp you the reason on the same
          number you provided at checkout.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    heading: "Still stuck?",
    body: (
      <>
        <p>
          If you&apos;ve raised a refund request and you&apos;re not satisfied
          with our response, you can escalate to the Federal Competition and
          Consumer Protection Commission (FCCPC) — <code>fccpc.gov.ng</code>.
          Our policy is to resolve cases before they get there. See the{" "}
          <Link href="/terms#law">Terms</Link> for the dispute-resolution
          clause.
        </p>
      </>
    ),
  },
];

export default function RefundsPage() {
  return (
    <PolicyShell
      eyebrow="Legal"
      title="Refund &amp; Cancellation Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          Wrong order, never arrived, or genuinely unsafe? Full refund. Minor
          cosmetic issue? Partial refund, re-make or credit. Address didn&apos;t
          work or change of mind after dispatch? Not refundable. Full detail
          below.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
