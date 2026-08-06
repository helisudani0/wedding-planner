import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GuestRow = {
  name: string;
  phone?: string | null;
  side?: string | null;
  family_name?: string | null;
  address?: string | null;
  guest_count?: number;
  coming?: string | null;
  food_preference?: string | null;
  invitation_given?: boolean;
  whatsapp_sent?: boolean;
  hotel_needed?: boolean;
  transport_needed?: boolean;
  notes?: string | null;
};

const ALIASES: Record<string, string[]> = {
  name: ["name", "guest", "guestname", "fullname", "નામ"],
  phone: ["phone", "mobile", "phonenumber", "contact", "whatsappnumber", "ફોન"],
  side: ["side", "brideside", "groomside", "brideorgroom", "પક્ષ"],
  family_name: ["family", "familyname", "surname", "કુટુંબ"],
  address: ["address", "city", "સરનામું"],
  guest_count: ["guestcount", "howmany", "numberofguests", "count", "pax", "members"],
  coming: ["coming", "rsvp", "attending", "confirmed"],
  food_preference: ["food", "foodpreference", "meal", "diet"],
  invitation_given: ["invitationgiven", "invited", "invitation", "cardgiven"],
  whatsapp_sent: ["whatsappsent", "whatsapp", "messagesent"],
  hotel_needed: ["hotelneeded", "hotel", "stay", "room"],
  transport_needed: ["transportneeded", "transport", "pickup", "car"],
  notes: ["notes", "note", "remark", "remarks", "નોંધ"],
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\u0A80-\u0AFF]/g, "");

function mapKey(header: string): string | null {
  const h = norm(header);
  for (const [field, list] of Object.entries(ALIASES)) {
    if (list.some((a) => h === norm(a))) return field;
  }
  for (const [field, list] of Object.entries(ALIASES)) {
    if (list.some((a) => h.includes(norm(a)))) return field;
  }
  return null;
}

const truthy = (v: unknown) =>
  ["yes", "y", "true", "1", "done", "given", "sent", "હા"].includes(String(v ?? "").trim().toLowerCase());

function toSide(v: unknown) {
  const s = String(v ?? "").toLowerCase();
  if (!s.trim()) return null;
  if (s.includes("groom") || s.includes("var")) return "Groom Side";
  if (s.includes("bride") || s.includes("kanya")) return "Bride Side";
  return String(v);
}

function toComing(v: unknown) {
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return null;
  if (["yes", "y", "true", "1", "coming", "confirmed"].includes(s)) return "Yes";
  if (["no", "n", "false", "0", "not coming"].includes(s)) return "No";
  if (s.startsWith("may")) return "Maybe";
  return null;
}

export function parseGuestSheet(buffer: ArrayBuffer): GuestRow[] {
  const wb = XLSX.read(buffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return [];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  const out: GuestRow[] = [];
  for (const r of raw) {
    const g: Record<string, unknown> = {};
    for (const [header, value] of Object.entries(r)) {
      const key = mapKey(header);
      if (!key) continue;
      if (value === "" || value === null || value === undefined) continue;
      switch (key) {
        case "guest_count": {
          const n = Number(String(value).replace(/[^0-9.]/g, ""));
          g[key] = Number.isFinite(n) && n > 0 ? Math.round(n) : 1;
          break;
        }
        case "invitation_given":
        case "whatsapp_sent":
        case "hotel_needed":
        case "transport_needed":
          g[key] = truthy(value);
          break;
        case "side":
          g[key] = toSide(value);
          break;
        case "coming":
          g[key] = toComing(value);
          break;
        case "phone":
          g[key] = String(value).trim();
          break;
        default:
          g[key] = String(value).trim();
      }
    }
    const name = String(g["name"] ?? "").trim();
    if (!name) continue;
    out.push({ ...(g as GuestRow), name, guest_count: (g["guest_count"] as number) ?? 1 });
  }
  return out;
}

export function GuestImport() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<GuestRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File) {
    try {
      const parsed = parseGuestSheet(await file.arrayBuffer());
      if (parsed.length === 0) {
        toast.error(t("No guests found in this file"));
        return;
      }
      setFileName(file.name);
      setRows(parsed);
    } catch {
      toast.error(t("Could not read this file"));
    }
  }

  async function confirmImport() {
    if (!rows) return;
    setBusy(true);
    try {
      for (let i = 0; i < rows.length; i += 200) {
        const { error } = await supabase.from("guests").insert(rows.slice(i, i + 200));
        if (error) throw error;
      }
      const { data } = await supabase.auth.getUser();
      const who =
        (data.user?.user_metadata?.["name"] as string) ||
        data.user?.email?.split("@")[0] ||
        "Someone";
      await supabase.from("activity_log").insert({
        actor_id: data.user?.id ?? null,
        actor_name: who,
        action: `added ${rows.length} guests from an Excel file`,
        entity_type: "guests",
      });
      await supabase
        .from("notifications")
        .insert({ user_id: null, title: `${who} added ${rows.length} guests` });
      qc.invalidateQueries({ queryKey: ["t", "guests"] });
      toast.success(`${rows.length} ${t("guests added")}`);
      setRows(null);
    } catch (e) {
      toast.error((e as Error)?.message ?? t("Could not save"));
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplate() {
    const ws = XLSX.utils.json_to_sheet([
      {
        Name: "Rakesh Patel",
        Phone: "9876543210",
        Side: "Bride Side",
        Family: "Patel",
        Address: "Ahmedabad",
        "How Many": 4,
        Coming: "Yes",
        Food: "Veg",
        "Invitation Given": "Yes",
        "WhatsApp Sent": "No",
        "Hotel Needed": "No",
        "Transport Needed": "No",
        Notes: "",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Guests");
    XLSX.writeFile(wb, "guest-list-template.xlsx");
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
          e.target.value = "";
        }}
      />
      <Button variant="outline" size="lg" onClick={() => inputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        {t("Import Excel")}
      </Button>

      <Dialog open={!!rows} onOpenChange={(o) => !o && setRows(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{t("Add these guests?")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" /> {fileName}
            </p>
            <p className="font-display text-xl">
              {rows?.length} {t("guests found")}
            </p>
            <ul className="max-h-52 space-y-1 overflow-y-auto rounded-2xl bg-muted/50 p-3 text-sm">
              {rows?.slice(0, 25).map((g, i) => (
                <li key={i} className="truncate">
                  {g.name}
                  {g.phone ? ` — ${g.phone}` : ""}
                  {g.side ? ` — ${t(g.side)}` : ""}
                </li>
              ))}
              {rows && rows.length > 25 && <li className="text-muted-foreground">…</li>}
            </ul>
            <Button variant="link" className="px-0" onClick={downloadTemplate}>
              {t("Download a sample Excel file")}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" size="lg" onClick={() => setRows(null)}>
              {t("Cancel")}
            </Button>
            <Button size="lg" disabled={busy} onClick={() => void confirmImport()}>
              {busy ? t("Adding…") : t("Add to guest list")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
