"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="destructive"
      size="lg"
      className="rounded-2xl h-14 w-full"
      onClick={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
    >
      <LogOut className="w-5 h-5 mr-2" /> Sign out
    </Button>
  );
}
