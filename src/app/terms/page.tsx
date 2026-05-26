import Link from "next/link";
import type { Metadata } from "next";
import { PolicyShell, type PolicySection } from "@/components/legal/PolicyShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules that cover ordering, paying for and receiving Wrapture wraps in Asaba, Nigeria.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "25 May 2026";

const SECTIONS: PolicySection[] = [
  {
    id: "about",
    heading: "About these terms",
    body: (
      <>
        <p>
          These Terms of Service (the &ldquo;Terms&rdquo;) govern your use of
          the Wrapture website, ordering pages and the order-tracking flow that
          runs over WhatsApp. They form a binding agreement between you and{" "}
          <strong>Wrapture</strong>, an unincorporated food business operating
          out of Asaba, Delta State, Nigeria (&ldquo;Wrapture,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us&rdquo;).
        </p>
        <p>
          By placing an order or using the site you confirm you have read and
          agreed to these Terms, our{" "}
          <Link href="/privacy">Privacy Policy</Link>, our{" "}
          <Link href="/refunds">Refund &amp; Cancellation Policy</Link> and our{" "}
          <Link href="/delivery">Delivery Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    heading: "Who can order",
    body: (
      <>
        <p>To place an order with Wrapture you must:</p>
        <ul>
          <li>be at least 18 years old (or have a parent/guardian place the order on your behalf);</li>
          <li>provide a valid Nigerian phone number, a delivery address inside our service area and a working email;</li>
          <li>be the lawful owner of the payment method you use at checkout.</li>
        </ul>
      </>
    ),
  },
  {
    id: "orders",
    heading: "Orders and menu",
    body: (
      <>
        <p>
          Items shown on the site are an invitation to order. An order is only
          confirmed once we receive proof of payment from Paystack
          <em> and </em> a member of our staff marks it as{" "}
          <strong>Accepted</strong> from our operations WhatsApp line.
        </p>
        <p>
          We may refuse or cancel an order at any time before delivery. Common
          reasons include items going out of stock, addresses outside our
          service area, suspected fraud or repeated abuse of the refund
          process. If we cancel a paid order you will receive a full refund —
          see the <Link href="/refunds">Refund Policy</Link> for timing.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    heading: "Pricing and currency",
    body: (
      <>
        <p>
          All prices are quoted in Nigerian Naira (₦) and are inclusive of VAT
          where applicable. The price shown on the cart at the moment you click
          <strong> Pay </strong>is the price that applies to your order, even
          if we update the menu afterwards. Delivery fees are added to the
          subtotal at checkout.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    heading: "Payment",
    body: (
      <>
        <p>
          Payments are processed by <strong>Paystack Payments Limited</strong>,
          a CBN-licensed Payment Solutions Service Provider. Wrapture does not
          collect, store or have access to your full card details — Paystack
          handles all card and bank-transfer data in line with PCI-DSS
          standards.
        </p>
        <p>
          When you submit payment you authorise Paystack to debit the amount
          shown for the order. If Paystack declines the transaction, the order
          will not be placed and no goods will be dispatched.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    heading: "Delivery",
    body: (
      <>
        <p>
          We deliver inside Asaba only. Delivery times, the rider handover
          process and the role of the tracking number are described in the{" "}
          <Link href="/delivery">Delivery Policy</Link>, which forms part of
          these Terms.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    heading: "Cancellations and refunds",
    body: (
      <>
        <p>
          You may cancel an order at any time before our kitchen has accepted
          it (status is still <em>Awaiting payment</em> or just{" "}
          <em>Paid</em>). Once the order moves to <strong>Accepted</strong> the
          kitchen has begun preparing food, and cancellation becomes subject
          to the <Link href="/refunds">Refund &amp; Cancellation Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "use",
    heading: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>place orders you do not intend to pay for or receive;</li>
          <li>use the WhatsApp ops line to send spam, threats or abusive content;</li>
          <li>copy, scrape, reverse-engineer or republish the site or our menu data without written permission;</li>
          <li>impersonate Wrapture staff, a rider or another customer;</li>
          <li>use the service for any unlawful purpose under Nigerian law, including the Cybercrime (Prohibition, Prevention, etc.) Act 2015.</li>
        </ul>
        <p>
          Breach of these rules may result in your account being suspended,
          your orders cancelled without refund (where the loss is reasonably
          attributable to the breach) and, where appropriate, referral to the
          relevant authorities.
        </p>
      </>
    ),
  },
  {
    id: "ip",
    heading: "Our intellectual property",
    body: (
      <>
        <p>
          The Wrapture name, logo, menu photography, recipe descriptions and
          site copy are owned by Wrapture and protected by the Copyright Act,
          Cap C28 LFN 2004 and the Trade Marks Act, Cap T13 LFN 2004. You may
          share links to the site freely. You may not reproduce or commercially
          reuse our content without our written permission.
        </p>
      </>
    ),
  },
  {
    id: "food-safety",
    heading: "Food, allergens and safety disclaimer",
    body: (
      <>
        <p>
          We prepare food in a shared kitchen. Cross-contact with common
          allergens — wheat, eggs, dairy, peanuts, tree nuts, fish, shellfish,
          soya and sesame — cannot be entirely ruled out, even when an item is
          described as &ldquo;free from&rdquo; one of them.
        </p>
        <p>
          If you have a serious food allergy or medical sensitivity, tell us
          on WhatsApp <strong>before</strong> you pay. We will either confirm
          we can prepare the order safely or advise you not to order. Wrapture
          is not responsible for allergic or medical reactions where the
          customer did not flag the allergy in advance.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <>
        <p>
          To the maximum extent permitted by Nigerian law, Wrapture&rsquo;s
          total liability to you for any claim arising from a single order is
          limited to the amount you paid for that order. We do not exclude
          liability for death, personal injury caused by our negligence, or any
          other liability that cannot lawfully be excluded.
        </p>
        <p>
          We are not liable for delays caused by events outside our reasonable
          control — including but not limited to power outages, fuel
          shortages, internet downtime, civil unrest, government action,
          extreme weather and disruption to Paystack or WhatsApp services.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    heading: "Suspension and termination",
    body: (
      <>
        <p>
          We may suspend or close your account, refuse future orders and
          terminate these Terms with respect to you if you breach them, abuse
          the refund process, attempt fraud against Wrapture or Paystack, or
          behave abusively toward our staff or riders. Where the closure is
          not your fault, any open paid order will be refunded in full.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these Terms",
    body: (
      <>
        <p>
          We may update these Terms from time to time. The current version is
          always at this URL, with the &ldquo;Last updated&rdquo; date refreshed
          at the top. Material changes (anything that affects price, refunds or
          your data rights) will be highlighted on the checkout page for at
          least seven days before they take effect.
        </p>
      </>
    ),
  },
  {
    id: "law",
    heading: "Governing law and disputes",
    body: (
      <>
        <p>
          These Terms are governed by the laws of the Federal Republic of
          Nigeria. Any dispute that cannot be resolved by good-faith negotiation
          within 30 days of written notice will be submitted to the exclusive
          jurisdiction of the courts of Delta State, sitting in Asaba.
        </p>
        <p>
          As a consumer you retain all rights you have under the Federal
          Competition and Consumer Protection Act 2018 (the &ldquo;FCCPC
          Act&rdquo;), including the right to fair, equal and non-discriminatory
          treatment and the right to lodge a complaint with the Federal
          Competition and Consumer Protection Commission.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <>
        <p>
          The fastest way to reach us is via the Wrapture WhatsApp line listed
          on the <Link href="/contact">Contact page</Link>. For legal notices
          email <code>legal@wrapture.ng</code> (placeholder — replace once a
          business email is set up). Postal address: Asaba, Delta State,
          Nigeria.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <PolicyShell
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          Plain-English summary: order with us, pay safely through Paystack,
          we deliver inside Asaba. Don&apos;t abuse the service. We&apos;ll
          treat you fairly and refund you when something is genuinely wrong on
          our side. Full detail below.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
