import Link from "next/link";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, address } from "@/db";
import { Header } from "@/components/layout/Header";
import { AddAddressForm } from "@/components/account/AddAddressForm";
import { AddressCard } from "@/components/account/AddressCard";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

export default async function AddressesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container-px pt-28 pb-16 max-w-2xl">
          <h1 className="font-display text-5xl mb-2">Saved addresses</h1>
          <p className="text-muted-foreground mb-10">Speed up checkout. Add the places you eat.</p>

          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <Bookmark className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-6">
              Addresses appear here once you check out. We save the spot you order to so you don&apos;t retype it next time.
            </p>
            <Button render={<Link href="/" />} size="lg" className="rounded-2xl h-12 px-6 uppercase tracking-widest text-xs">
              Browse menu
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const list = await db
    .select()
    .from(address)
    .where(eq(address.userId, session.user.id))
    .orderBy(desc(address.isDefault), desc(address.createdAt));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl">
        <h1 className="font-display text-5xl mb-2">Saved addresses</h1>
        <p className="text-muted-foreground mb-10">Speed up checkout. Add the places you eat.</p>

        <AddAddressForm />

        <div className="mt-8 space-y-3">
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No addresses yet.</p>
          )}
          {list.map((a) => (
            <AddressCard key={a.id} address={a} />
          ))}
        </div>
      </main>
    </div>
  );
}
