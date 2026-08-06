import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Download, Trash2 } from "lucide-react";
import { useRows, useSaveRow, useDeleteRow, uploadFile } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIES = ["Bills", "Receipts", "Contracts", "Guest Lists", "Photos", "Videos", "Other"];

export const Route = createFileRoute("/_authenticated/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Megha's Wedding Planner" },
      { name: "description", content: "Bills, receipts, contracts and files, ready to download anytime." },
      { property: "og:title", content: "Documents — Megha's Wedding Planner" },
      { property: "og:description", content: "All wedding papers safe in one place." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const { t } = useI18n();
  const { data } = useRows("documents", { order: "created_at", asc: false });
  const save = useSaveRow("documents", "Documents");
  const remove = useDeleteRow("documents");
  const [category, setCategory] = useState("Bills");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadFile(file, "documents");
      save.mutate({ title: file.name, category, file_url: url, file_type: file.type });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const rows = (data ?? []).filter((d: any) => filter === "all" || d.category === filter);

  return (
    <div className="rise-in">
      <PageHeader title="Documents" subtitle="Bills, receipts and contracts" />
      <div className="card-warm mb-4 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-40">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{t(c)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button asChild size="lg" disabled={busy}>
          <label className="cursor-pointer">
            <Upload className="mr-2 h-5 w-5" />
            {busy ? t("Saving") : t("Upload")}
            <Input type="file" className="hidden" onChange={onUpload} />
          </label>
        </Button>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-12 w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Everything")}</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{t(c)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map((d: any) => (
          <li key={d.id} className="card-warm flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{d.title}</p>
              <p className="text-sm text-muted-foreground">{t(d.category)}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button asChild variant="ghost" size="icon">
                <a href={d.file_url} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /></a>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(d)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </li>
        ))}
        {rows.length === 0 && <p className="text-muted-foreground">{t("Nothing here yet")}</p>}
      </ul>
    </div>
  );
}
