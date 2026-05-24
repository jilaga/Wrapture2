import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Bookmark, Package, ShoppingBag } from "lucide-react";
import { SignOutButton } from "@/components/account/SignOutButton";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container-px pt-28 pb-16 max-w-2xl">
          <h1 className="font-display text-5xl md:text-6xl mb-2">Your account</h1>
          <p className="text-muted-foreground mb-10">
            No account yet. Drop your details at checkout and we&apos;ll create one for you — no password needed.
          </p>
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-6">
              Pick something from the menu, then check out to identify yourself.
            </p>
            <div className="flex gap-3 justify-center">
              <Button render={<Link href="/" />} size="lg" className="rounded-2xl h-12 px-6 uppercase tracking-widest text-xs">
                Browse menu
              </Button>
              <Button variant="outline" render={<Link href="/login" />} size="lg" className="rounded-2xl h-12 px-6 uppercase tracking-widest text-xs">
                Have an account?
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl">
        <h1 className="font-display text-5xl md:text-6xl mb-2">Your account</h1>
        <p className="text-muted-foreground mb-10">Hey {session.user.name?.split(" ")[0] ?? "you"}.</p>

        <section className="rounded-3xl border border-border bg-card p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{session.user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{session.user.email}</dd>
            </div>
          </dl>
        </section>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Button variant="outline" size="lg" className="rounded-2xl h-14 justify-start" render={<Link href="/orders" />}>
            <Package className="w-5 h-5 mr-2" /> Your orders
          </Button>
          <Button variant="outline" size="lg" className="rounded-2xl h-14 justify-start" render={<Link href="/addresses" />}>
            <Bookmark className="w-5 h-5 mr-2" /> Saved addresses
          </Button>
        </div>

        <SignOutButton />
      </main>
    </div>
  );
}
