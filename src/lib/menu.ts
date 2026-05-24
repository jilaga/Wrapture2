export type MenuCategory = "Wraps" | "Sides" | "Grill" | "Drinks";

export type MenuItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  proof: string;
  category: MenuCategory;
};

export const MENU: MenuItem[] = [
  {
    id: "classic",
    name: "Classic Chicken Shawarma",
    tagline: "Grilled chicken, garlic sauce, suya spice, fresh veggies.",
    price: 8000,
    image: "/menu/menu-classic.jpg",
    proof: "Customer favourite",
    category: "Wraps",
  },
  {
    id: "blood",
    name: "Bloodline Beef",
    tagline: "Smoked beef, scotch bonnet, charred onions, ember sauce.",
    price: 9500,
    image: "/menu/menu-beef.jpg",
    proof: "Most ordered",
    category: "Wraps",
  },
  {
    id: "fury",
    name: "Fury Fries",
    tagline: "Loaded fries, pulled chicken, jalapeño, signature drip.",
    price: 6500,
    image: "/menu/menu-fries.jpg",
    proof: "Late-night pick",
    category: "Sides",
  },
  {
    id: "suya",
    name: "Suya Skewers",
    tagline: "Open-flame skewers dusted in our 9-spice yaji.",
    price: 7200,
    image: "/menu/menu-suya.jpg",
    proof: "Grill house staple",
    category: "Grill",
  },
];

export const REVIEWS = [
  { platform: "WhatsApp", name: "Ada", text: "Omo, the suya skewers are unreal. My whole office is converted.", color: "bg-[#dcf8c6] text-[#0b3d2e]" },
  { platform: "Twitter", name: "@kene_x", text: "Wrapture chicken shawarma > every spot in Asaba. I said what I said.", color: "bg-white text-black" },
  { platform: "Instagram", name: "@tomi.eats", text: "the garlic sauce??? excuse me???? 🔥🔥", color: "bg-white text-black" },
  { platform: "Facebook", name: "Chinedu O.", text: "Ordered for the family on Sunday. Delivered hot. 10/10 will repeat.", color: "bg-[#f0f2f5] text-black" },
  { platform: "WhatsApp", name: "Mide", text: "Late-night fries saved my life last night 😭", color: "bg-[#dcf8c6] text-[#0b3d2e]" },
  { platform: "Twitter", name: "@asabaeats", text: "Bloodline Beef is genuinely one of the best wraps in the south.", color: "bg-white text-black" },
  { platform: "Instagram", name: "@dami.k", text: "the way they wrap it tight tight tight 👌", color: "bg-white text-black" },
  { platform: "WhatsApp", name: "Zara", text: "Rider got here in 28 mins. Still steaming.", color: "bg-[#dcf8c6] text-[#0b3d2e]" },
  { platform: "Facebook", name: "Ifeoma U.", text: "My kids fight over the fries now. Please open in Warri.", color: "bg-[#f0f2f5] text-black" },
];

export const REELS = [
  { img: "/menu/menu-suya.jpg", label: "Open flame" },
  { img: "/menu/menu-fries.jpg", label: "Fries drop" },
  { img: "/menu/menu-classic.jpg", label: "Wrap & roll" },
  { img: "/menu/menu-beef.jpg", label: "Beef sear" },
  { img: "/menu/menu-classic.jpg", label: "Sauce pour" },
  { img: "/menu/menu-suya.jpg", label: "Rider pickup" },
];

export const formatNGN = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export const getMenuItem = (id: string) => MENU.find((m) => m.id === id);
