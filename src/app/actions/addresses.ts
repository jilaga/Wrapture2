"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, address } from "@/db";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

export type SavedAddress = {
  id: string;
  label: string;
  line: string;
  city: string;
  isDefault: boolean;
};

export async function listMyAddresses(): Promise<SavedAddress[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];
  const rows = await db
    .select()
    .from(address)
    .where(eq(address.userId, session.user.id))
    .orderBy(desc(address.isDefault), desc(address.createdAt));
  return rows.map((a) => ({
    id: a.id,
    label: a.label,
    line: a.line,
    city: a.city,
    isDefault: a.isDefault,
  }));
}

export async function addAddress(form: FormData) {
  const userId = await requireUser();
  const label = (form.get("label") ?? "Home").toString();
  const line = (form.get("line") ?? "").toString();
  const city = (form.get("city") ?? "Asaba").toString();
  const phone = (form.get("phone") ?? "").toString() || null;

  if (!line.trim()) return { ok: false, error: "Address required" };

  await db.insert(address).values({ userId, label, line, city, phone });
  revalidatePath("/addresses");
  return { ok: true };
}

export async function deleteAddress(id: string) {
  const userId = await requireUser();
  await db.delete(address).where(and(eq(address.id, id), eq(address.userId, userId)));
  revalidatePath("/addresses");
}

export async function setDefaultAddress(id: string) {
  const userId = await requireUser();
  await db.update(address).set({ isDefault: false }).where(eq(address.userId, userId));
  await db.update(address).set({ isDefault: true }).where(and(eq(address.id, id), eq(address.userId, userId)));
  revalidatePath("/addresses");
}
