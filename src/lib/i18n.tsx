import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "gu";

const gu: Record<string, string> = {
  // App
  "Megha's Wedding": "મેઘાના લગ્ન",
  "Family Wedding Planner": "કુટુંબ લગ્ન પ્લાનર",
  // Nav
  Home: "ઘર",
  "Today's Plan": "આજની યોજના",
  "Wedding Schedule": "લગ્ન કાર્યક્રમ",
  "Guest List": "મહેમાન યાદી",
  Budget: "બજેટ",
  Shopping: "ખરીદી",
  Tasks: "કામ",
  "Service Providers": "સેવા આપનાર",
  Catering: "જમણવાર",
  Documents: "દસ્તાવેજ",
  "Photo Gallery": "ફોટો ગેલેરી",
  Notes: "નોંધ",
  Contacts: "સંપર્ક",
  Calendar: "કેલેન્ડર",
  Progress: "પ્રગતિ",
  Family: "કુટુંબ",
  Chat: "વાતચીત",
  Reminders: "યાદ અપાવો",
  "Master Checklist": "મુખ્ય યાદી",
  "Puja Items": "પૂજા સામગ્રી",
  "Packing List": "પેકિંગ યાદી",
  "Photo Checklist": "ફોટો યાદી",
  "Return Gifts": "વળતર ભેટ",
  "Dance Planner": "ડાન્સ યોજના",
  "Music Playlist": "સંગીત યાદી",
  "Outfit Planner": "કપડાં યોજના",
  "Jewellery Planner": "ઘરેણાં યોજના",
  "Hotel Rooms": "હોટેલ રૂમ",
  Travel: "વાહન વ્યવસ્થા",
  Seating: "બેઠક વ્યવસ્થા",
  "Food Planner": "ભોજન યોજના",
  "Live Mode": "લાઈવ મોડ",
  Activity: "ઇતિહાસ",
  Search: "શોધો",
  // Common
  Add: "ઉમેરો",
  Edit: "ફેરફાર",
  Delete: "કાઢી નાખો",
  Save: "સાચવો",
  Cancel: "રદ કરો",
  Close: "બંધ કરો",
  Yes: "હા",
  No: "ના",
  Maybe: "કદાચ",
  Done: "પૂર્ણ",
  Pending: "બાકી",
  "In Progress": "ચાલુ",
  Urgent: "તાત્કાલિક",
  Completed: "પૂર્ણ થયું",
  Total: "કુલ",
  Spent: "વપરાયું",
  Left: "બાકી",
  Name: "નામ",
  Phone: "ફોન",
  Date: "તારીખ",
  Time: "સમય",
  Venue: "સ્થળ",
  Price: "કિંમત",
  Amount: "રકમ",
  "Nothing here yet": "અહીં હજી કંઈ નથી",
  "Sign in": "લોગ ઇન",
  "Sign out": "લોગ આઉટ",
  Email: "ઈમેલ",
  Password: "પાસવર્ડ",
  Days: "દિવસ",
  Hours: "કલાક",
  Minutes: "મિનિટ",
  "days to go": "દિવસ બાકી",
  "Share on WhatsApp": "વોટ્સએપ પર મોકલો",
  Guests: "મહેમાનો",
  Bought: "ખરીદ્યું",
  Paid: "ચૂકવ્યું",
  "Assigned To": "કોને સોંપ્યું",
  "Due Date": "છેલ્લી તારીખ",
  Priority: "અગ્રતા",
  Category: "વિભાગ",
  Status: "સ્થિતિ",
  "Add new": "નવું ઉમેરો",
  Upload: "અપલોડ",
  Everything: "બધું",
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (s: string) => string };
const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (s) => s });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "gu" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("lang", l);
  }, []);

  const t = useCallback((s: string) => (lang === "gu" ? (gu[s] ?? s) : s), [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  return useContext(LangContext);
}
