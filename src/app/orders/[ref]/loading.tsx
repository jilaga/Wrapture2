import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl">
        <Skeleton className="h-3 w-24 mb-6" />
        <Skeleton className="h-12 w-72 mb-4" />
        <Skeleton className="h-3 w-32 mb-1" />
        <Skeleton className="h-8 w-40 mb-4" />
        <Skeleton className="h-3 w-20 mb-1" />
        <Skeleton className="h-4 w-48 mb-10" />

        <section className="rounded-3xl border border-border bg-card p-6 mb-6">
          <Skeleton className="h-3 w-16 mb-5" />
          <div className="space-y-5">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1.5" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 mb-6">
          <Skeleton className="h-3 w-20 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-5" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <Skeleton className="h-3 w-16 mb-4" />
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
