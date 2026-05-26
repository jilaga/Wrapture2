import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddressesLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl">
        <Skeleton className="h-12 w-56 mb-2" />
        <Skeleton className="h-4 w-72 mb-10" />

        <div className="space-y-3 mb-8">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>

        <Skeleton className="h-14 w-full rounded-2xl" />
      </main>
    </div>
  );
}
