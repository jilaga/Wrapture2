"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn.email({ email, password, callbackURL: "/account" });
    setPending(false);
    if (res.error) {
      toast.error(res.error.message ?? "Login failed");
    } else {
      router.push("/account");
    }
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/account" });
  };

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl tracking-tight block mb-8 text-center">
          WRAP<span className="text-primary">TURE</span>
        </Link>
        <h1 className="font-display text-3xl mb-6 text-center">Welcome back</h1>

        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <Button type="submit" disabled={pending} size="lg" className="w-full rounded-2xl h-12 uppercase tracking-widest text-xs">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
        </div>

        <Button onClick={handleGoogle} variant="outline" size="lg" className="w-full rounded-2xl h-12">
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
