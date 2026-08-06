import {
  Home,
  CalendarDays,
  Users,
  Wallet,
  ListChecks,
  Store,
  UtensilsCrossed,
  FileText,
  Images,
  StickyNote,
  Phone,
  CalendarRange,
  TrendingUp,
  UsersRound,
  MessageCircle,
  BellRing,
  CheckSquare,
  Flame,
  Luggage,
  Camera,
  Gift,
  Music,
  Sparkles,
  Shirt,
  Gem,
  BedDouble,
  Car,
  Armchair,
  Radio,
  History,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon; group: string };

export const NAV: NavItem[] = [
  { to: "/home", label: "Home", icon: Home, group: "Main" },
  { to: "/today", label: "Today's Plan", icon: Flame, group: "Main" },
  { to: "/live", label: "Live Mode", icon: Radio, group: "Main" },
  { to: "/schedule", label: "Wedding Schedule", icon: CalendarDays, group: "Main" },
  { to: "/calendar", label: "Calendar", icon: CalendarRange, group: "Main" },
  { to: "/progress", label: "Progress", icon: TrendingUp, group: "Main" },

  { to: "/guests", label: "Guest List", icon: Users, group: "Planning" },
  { to: "/tasks", label: "Tasks", icon: ListChecks, group: "Planning" },
  { to: "/budget", label: "Budget", icon: Wallet, group: "Planning" },
  { to: "/providers", label: "Service Providers", icon: Store, group: "Planning" },
  { to: "/catering", label: "Catering", icon: UtensilsCrossed, group: "Planning" },
  { to: "/reminders", label: "Reminders", icon: BellRing, group: "Planning" },

  { to: "/checklist", label: "Master Checklist", icon: CheckSquare, group: "Checklists" },
  { to: "/puja", label: "Puja Items", icon: Sparkles, group: "Checklists" },
  { to: "/packing", label: "Packing List", icon: Luggage, group: "Checklists" },
  { to: "/photo-checklist", label: "Photo Checklist", icon: Camera, group: "Checklists" },
  { to: "/return-gifts", label: "Return Gifts", icon: Gift, group: "Checklists" },

  { to: "/dance", label: "Dance Planner", icon: Music, group: "Celebration" },
  { to: "/music", label: "Music Playlist", icon: Music, group: "Celebration" },
  { to: "/outfits", label: "Outfit Planner", icon: Shirt, group: "Celebration" },
  { to: "/jewellery", label: "Jewellery Planner", icon: Gem, group: "Celebration" },
  { to: "/seating", label: "Seating", icon: Armchair, group: "Celebration" },
  { to: "/gallery", label: "Photo Gallery", icon: Images, group: "Celebration" },

  { to: "/hotel", label: "Hotel Rooms", icon: BedDouble, group: "People & Stay" },
  { to: "/travel", label: "Travel", icon: Car, group: "People & Stay" },
  { to: "/contacts", label: "Contacts", icon: Phone, group: "People & Stay" },
  { to: "/family", label: "Family", icon: UsersRound, group: "People & Stay" },

  { to: "/documents", label: "Documents", icon: FileText, group: "More" },
  { to: "/notes", label: "Notes", icon: StickyNote, group: "More" },
  { to: "/chat", label: "Chat", icon: MessageCircle, group: "More" },
  { to: "/activity", label: "Activity", icon: History, group: "More" },
];

export const NAV_GROUPS = ["Main", "Planning", "Checklists", "Celebration", "People & Stay", "More"];

export const WEDDING_DATE = "2026-12-06T00:00:00";
export const BRIDE_NAME = "Megha";

export const EXPENSE_CATEGORIES = [
  "Venue",
  "Decoration",
  "Food",
  "Clothes",
  "Jewellery",
  "Photography",
  "Makeup",
  "Mehendi",
  "Music",
  "Travel",
  "Hotel",
  "Gifts",
  "Miscellaneous",
];

export const TASK_CATEGORIES = ["General", "Shopping", "Vendor Booking", "Documentation", "Other"];

export const SHOPPING_LISTS = [
  "Bride",
  "Mother",
  "Father",
  "Sister",
  "Family",
  "Decoration",
  "Return Gifts",
  "Wedding Essentials",
  "Kitchen",
  "Temple Items",
];

export const VENDOR_CATEGORIES = [
  "Caterer",
  "Decorator",
  "Photographer",
  "Videographer",
  "Makeup Artist",
  "Mehendi Artist",
  "DJ",
  "Band",
  "Florist",
  "Pandit",
  "Hotel",
  "Car Rental",
  "Tailor",
  "Jeweller",
  "Tent",
  "Sound System",
];

export const FUNCTION_NAMES = [
  "Mehendi",
  "Geet",
  "Mandap Muhurat",
  "Haldi",
  "Garba",
  "Mameru",
  "Jaan Arrival",
  "Wedding Ceremony",
  "Reception",
  "Engagement",
];

export const DANCE_GROUPS = [
  "Mehendi",
  "Garba",
  "Geet",
  "Bride Entry",
  "Groom Entry",
  "Couple Dance",
  "Family Dance",
  "Sister Dance",
  "Friends Dance",
  "Reception",
];

export const PLAYLISTS = ["Mehendi", "Haldi", "Garba", "Mameru", "Jaan", "Wedding", "Reception"];

export function inr(n: number | null | undefined) {
  return "₹" + Number(n ?? 0).toLocaleString("en-IN");
}

export function shareWhatsApp(text: string) {
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
}
