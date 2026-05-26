import Link from "next/link";
import type { Metadata } from "next";
import { PolicyShell, type PolicySection } from "@/components/legal/PolicyShell";

export const metadata: Metadata = {
  title: "Delivery Policy",
  description:
    "Where Wrapture delivers, how long it takes, the rider handover and what happens when something goes wrong en route.",
  alternates: { canonical: "/delivery" },
};

const LAST_UPDATED = "25 May 2026";

const SECTIONS: PolicySection[] = [
  {
    id: "area",
    heading: "Where we deliver",
    body: (
      <>
        <p>
          We deliver inside Asaba, Delta State only. If you give us an
          address outside the city we&apos;ll cancel and refund the order in
          full before dispatch. We hope to expand to Onitsha and the wider
          Anioma region soon — if you&apos;d like that, WhatsApp us and
          we&apos;ll know there&apos;s demand.
        </p>
      </>
    ),
  },
  {
    id: "hours",
    heading: "Hours",
    body: (
      <>
        <p>
          We accept orders from <strong>11:00 to 22:30</strong> daily.
          Deliveries are completed by 23:00. Public-holiday hours are
          announced on the homepage and over WhatsApp.
        </p>
      </>
    ),
  },
  {
    id: "eta",
    heading: "Delivery time",
    body: (
      <>
        <p>
          Typical end-to-end time from payment confirmation to your door is
          <strong> 35&ndash;45 minutes</strong>. We aim to keep this
          consistent but cannot guarantee it on any individual order — rush
          hour, weather and order volume all play a role.
        </p>
        <p>
          You can watch the status change live on the order page using the
          tracking number we send you. When the order is marked{" "}
          <strong>Out for delivery</strong>, your rider&apos;s name and phone
          number appear on that page.
        </p>
      </>
    ),
  },
  {
    id: "fee",
    heading: "Delivery fee",
    body: (
      <>
        <p>
          The delivery fee is shown in the cart before you pay. As of this
          version it is a flat ₦1,500 within Asaba. For very distant
          neighbourhoods inside the city we may charge a top-up — if so, it
          is disclosed at checkout, never added after the fact.
        </p>
      </>
    ),
  },
  {
    id: "address",
    heading: "Address requirements",
    body: (
      <>
        <p>
          Help us help you: give us as much detail as possible — house number,
          street, a landmark, the gate colour, an estate name. Vague addresses
          (&ldquo;blue gate near the church&rdquo;) genuinely cost time and
          sometimes mean cold food. You can save addresses to your account
          for next time.
        </p>
      </>
    ),
  },
  {
    id: "handover",
    heading: "Rider handover and tracking number",
    body: (
      <>
        <p>
          The 6-digit tracking number on your order is your proof of identity
          for the handover. The rider will ask for it before handing the bag
          over. If the number you give matches the one tied to the order on
          our system, the food is yours. If it doesn&apos;t, the rider will
          call our line before releasing the order.
        </p>
        <p>
          This is deliberately low-tech — no OTP, no signature pad. It works
          because the tracking number is unique to your order and unguessable.
        </p>
      </>
    ),
  },
  {
    id: "customer-absent",
    heading: "If you&apos;re not there",
    body: (
      <>
        <p>
          When the rider reaches the confirmed address, they call the phone
          number you supplied at checkout and wait <strong>10 minutes</strong>.
          If we still cannot reach you, the order is returned to base.
        </p>
        <p>
          You can re-arrange a second delivery to the same address by
          WhatsApping our ops line within 30 minutes. A re-delivery fee equal
          to the original delivery charge applies. Food cannot be re-delivered
          if more than an hour has passed — kitchen safety standards prevent
          us from sending out food that has sat at room temperature for that
          long.
        </p>
      </>
    ),
  },
  {
    id: "wrong-address",
    heading: "Wrong or unreachable address",
    body: (
      <>
        <p>
          If the address you gave us turns out to be wrong, the rider will
          call you to clarify. Up to 1km from the original address, we
          redirect without changing the fee. Beyond that, we may charge an
          additional delivery fee or, in extreme cases, return the order to
          base under the same rules as &ldquo;If you&apos;re not there.&rdquo;
        </p>
      </>
    ),
  },
  {
    id: "safety",
    heading: "Food safety at delivery",
    body: (
      <>
        <p>
          Every order ships in sealed packaging. If the seal is broken when
          you receive it, please tell the rider on the spot. We&apos;d rather
          send a fresh batch on a re-delivery than have you risk an opened
          item.
        </p>
        <p>
          Riders are instructed to use insulated bags and to keep cold items
          (drinks, sauces) separate from hot wraps. If your order arrives at
          a temperature that suggests prolonged sitting (cold wraps, warm
          drinks) you may apply for a partial refund under the{" "}
          <Link href="/refunds">Refund Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "risk",
    heading: "When risk passes to you",
    body: (
      <>
        <p>
          Risk in the goods passes to you when the rider hands the bag over
          at the agreed address. Up to that point, any loss or damage in
          transit is on us.
        </p>
      </>
    ),
  },
  {
    id: "tipping",
    heading: "Tipping",
    body: (
      <>
        <p>
          Tipping the rider is welcome but never required. Riders keep 100%
          of any tip you give them. We do not deduct from their delivery fee.
        </p>
      </>
    ),
  },
];

export default function DeliveryPage() {
  return (
    <PolicyShell
      eyebrow="Legal"
      title="Delivery Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          Asaba only, 11:00&ndash;22:30, typically 35&ndash;45 minutes to your
          door. Your 6-digit tracking number is what the rider checks at
          handover. Full detail below.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
