"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { MENU, formatNGN } from "@/lib/menu";
import { useCart } from "@/store/cart";

function MenuCard({ item, idx }: { item: (typeof MENU)[number]; idx: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
      className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <Badge className="absolute top-4 left-4 rounded-2xl bg-background/90 text-foreground border-0 backdrop-blur text-[11px] uppercase tracking-widest px-3 py-1">
          {item.proof}
        </Badge>
      </div>
      <div className="p-6 md:p-7 flex flex-col gap-4">
        <div>
          <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.tagline}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-semibold">{formatNGN(item.price)}</span>
          {items[item.id] ? (
            <div className="flex items-center gap-1 rounded-2xl border border-border bg-background">
              <button onClick={() => remove(item.id)} className="p-2.5 hover:bg-secondary rounded-2xl" aria-label="Decrease">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm w-5 text-center font-semibold">{items[item.id]}</span>
              <button onClick={() => add(item.id)} className="p-2.5 hover:bg-secondary rounded-2xl" aria-label="Increase">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              onClick={() => add(item.id)}
              className="rounded-2xl h-11 px-5 text-xs uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90"
            >
              Add to bag
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function MenuSection() {
  const address = useCart((s) => s.address);
  const setAddress = useCart((s) => s.setAddress);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.4 });

  return (
    <>
      <section className="sticky top-16 z-40 backdrop-blur bg-[color:var(--background)]/90 border-b border-border">
        <div className="container-px py-3">
          <div className="flex items-center gap-3 bg-card rounded-2xl border border-border px-4 h-12">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              className="border-0 bg-transparent text-sm focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      <section id="menu" className="container-px py-16 md:py-20">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 24 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground mb-3">— The menu</p>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.9]">
              Made hot.<br />Delivered hot.
            </h2>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {MENU.map((m, i) => (
            <MenuCard key={m.id} item={m} idx={i} />
          ))}
        </div>
      </section>
    </>
  );
}
