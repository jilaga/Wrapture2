import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl">
        <Skeleton className="h-3 w-16 mb-3" />
        <Skeleton className="h-12 w-64 mb-10" />

        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex justify-between pt-3 border-t border-border">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
