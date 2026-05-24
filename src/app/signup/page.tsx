"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, signIn } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signUp.email({ email, password, name, callbackURL: "/account" });
    setPending(false);
    if (res.error) {
      toast.error(res.error.message ?? "Signup failed");
    } else {
      router.push("/account");
    }
  };

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl tracking-tight block mb-8 text-center">
          WRAP<span className="text-primary">TURE</span>
        </Link>
        <h1 className="font-display text-3xl mb-6 text-center">Join the heat</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
            <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          <Button type="submit" disabled={pending} size="lg" className="w-full rounded-2xl h-12 uppercase tracking-widest text-xs">
            {pending ? "Creating…" : "Create account"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
        </div>

        <Button
          onClick={() => signIn.social({ provider: "google", callbackURL: "/account" })}
          variant="outline"
          size="lg"
          className="w-full rounded-2xl h-12"
        >
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
