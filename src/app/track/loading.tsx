import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrackLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-xl">
        <Skeleton className="h-12 w-56 mb-2" />
        <Skeleton className="h-4 w-80 mb-10" />

        <div className="flex gap-2 mb-8">
          <Skeleton className="flex-1 h-12 rounded-2xl" />
          <Skeleton className="h-12 w-24 rounded-2xl" />
        </div>

        <article className="rounded-3xl border border-border bg-card p-6">
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
