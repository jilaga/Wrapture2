import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER?.replace(/\D/g, "") ?? "";
  if (!wa) return null;

  return (
    <a
      href={`https://wa.me/${wa}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Wrapture on WhatsApp"
      className="group fixed z-40 bottom-5 right-5 md:bottom-7 md:right-7
                 flex items-center gap-3 rounded-full
                 bg-primary text-primary-foreground
                 pl-4 pr-5 h-14 shadow-blood
                 hover:bg-primary/90 transition-all
                 hover:gap-4"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/50 animate-ping opacity-60"
      />
      <span className="relative flex items-center gap-3">
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] font-medium">
          Chat
        </span>
      </span>
    </a>
  );
}
