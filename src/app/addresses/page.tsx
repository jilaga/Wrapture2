import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, address } from "@/db";
import { Header } from "@/components/layout/Header";
import { AddAddressForm } from "@/components/account/AddAddressForm";
import { AddressCard } from "@/components/account/AddressCard";

export default async function AddressesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

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
