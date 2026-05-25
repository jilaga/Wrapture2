import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";

export type PolicySection = {
  id: string;
  heading: string;
  body: ReactNode;
};

export function PolicyShell({
  eyebrow,
  title,
  lastUpdated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro?: ReactNode;
  sections: PolicySection[];
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-3xl flex-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
          {eyebrow}
        </p>
        <h1 className="font-display text-5xl md:text-6xl mb-3 leading-[0.95]">
          {title}
        </h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-10">
          Last updated · {lastUpdated}
        </p>

        {intro && (
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 mb-10 text-sm leading-relaxed">
            {intro}
          </div>
        )}

        <nav
          aria-label="Sections on this page"
          className="rounded-3xl border border-border bg-card p-6 mb-10"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Contents
          </p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors flex gap-3"
                >
                  <span className="text-[10px] uppercase tracking-widest pt-1 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s.heading}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="rounded-3xl border border-border bg-card p-6 md:p-8 scroll-mt-28"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="font-display text-2xl md:text-3xl mb-4">
                {s.heading}
              </h2>
              <div className="prose-policy text-sm leading-relaxed text-foreground/90 space-y-3">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          Questions about this page? WhatsApp us — link in the footer.
        </div>
      </main>
      <Footer />
    </div>
  );
}
