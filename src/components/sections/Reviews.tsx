"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { REVIEWS } from "@/lib/menu";

const rotations = [
  "-rotate-3",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "-rotate-2",
  "rotate-1",
  "rotate-2",
  "-rotate-3",
  "rotate-1",
];

const TICKER = [
  "Hot off the grill",
  "Open 11:00 – 23:00",
  "Free delivery > ₦15k",
  "Asaba only",
  "Cash & card",
];

export function Reviews() {
  const headRef = useRef<HTMLDivElement | null>(null);
  const headView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section className="py-20 md:py-28 cork relative overflow-hidden">
      {/* marquee ticker — actually wired now */}
      <div className="absolute top-0 inset-x-0 bg-black/30 border-y border-white/10 overflow-hidden">
        <div className="flex whitespace-nowrap py-3 animate-marquee">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="text-[hsl(36_30%_94%)] text-xs uppercase tracking-[0.3em] ticker-divider">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="container-px relative pt-10">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-center mb-12 text-[hsl(36_30%_94%)]"
        >
          <p className="uppercase tracking-[0.3em] text-xs text-[hsl(36_30%_94%)]/70 mb-3">— Word on the street</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.9]">
            People genuinely<br />
            <span className="text-primary">love this shawarma.</span>
          </h2>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: "easeOut" }}
              className={`pin-card mb-5 break-inside-avoid rounded-2xl p-4 ${r.color} ${rotations[i % rotations.length]} relative`}
            >
              <span
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                aria-hidden
              />
              <div className="flex items-center justify-between mb-2 text-[10px] uppercase tracking-widest opacity-70">
                <span>{r.platform}</span>
                <span>{r.name}</span>
              </div>
              <p className="text-[15px] leading-snug">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
