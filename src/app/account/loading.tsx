import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl">
        <Skeleton className="h-12 w-56 mb-2" />
        <Skeleton className="h-4 w-80 mb-10" />

        <div className="rounded-3xl border border-border bg-card p-6 mb-6">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>

        <Skeleton className="h-12 w-40 rounded-2xl" />
      </main>
    </div>
  );
}
