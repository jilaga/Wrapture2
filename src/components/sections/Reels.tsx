"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play } from "lucide-react";
import { REELS } from "@/lib/menu";

export function Reels() {
  const headRef = useRef<HTMLDivElement | null>(null);
  const headView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section className="py-20 md:py-24">
      <div className="container-px mb-8 flex items-end justify-between">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground mb-3">— From the kitchen</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[0.9]">Smoke. Sizzle. Send.</h2>
        </motion.div>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-4 px-[max(1rem,calc((100vw-1280px)/2))] pb-4">
          {REELS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="relative shrink-0 w-[220px] md:w-[260px] aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer"
            >
              <Image src={r.img} alt={r.label} fill sizes="260px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="w-12 h-12 rounded-full bg-white/90 grid place-items-center group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                </div>
              </div>
              <p className="absolute bottom-4 left-4 text-white text-sm uppercase tracking-widest">{r.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
