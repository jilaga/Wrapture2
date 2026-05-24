"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu as MenuIcon, ChevronRight, Package, Truck, User, Bookmark, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart, useCartCount } from "@/store/cart";
import { CartSheet } from "@/components/cart/CartSheet";

const MENU_LINKS = [
  { icon: Package, label: "Orders", href: "/orders" },
  { icon: Truck, label: "Track order", href: "/track" },
  { icon: User, label: "Login / Account", href: "/account" },
  { icon: Bookmark, label: "Saved addresses", href: "/addresses" },
  { icon: Phone, label: "Contact", href: "/contact" },
  { icon: HelpCircle, label: "FAQs", href: "/faqs" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = useCartCount();
  const hydrated = useCart((s) => s.hydrated);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
        <div className="container-px flex items-center justify-between h-16">
          <Link href="/" className="font-display text-xl tracking-tight">
            WRAP<span className="text-primary">TURE</span>
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => setCartOpen(true)}
              className="relative rounded-2xl"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {hydrated && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 rounded-full bg-primary text-primary-foreground text-[10px] min-w-[18px] h-[18px] px-1 grid place-items-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-lg" className="rounded-2xl" aria-label="Open menu">
                    <MenuIcon className="w-5 h-5" />
                  </Button>
                }
              />
              <SheetContent className="bg-background border-border w-full sm:max-w-sm p-0">
                <SheetHeader className="p-6 border-b border-border">
                  <SheetTitle className="font-display text-2xl text-left">Menu</SheetTitle>
                </SheetHeader>
                <nav className="p-3">
                  {MENU_LINKS.map(({ icon: Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-secondary transition-colors text-left"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-base">{label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
