import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Trash2, Heart } from "lucide-react";
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
import { FUNCTION_NAMES } from "@/lib/wedding";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/gallery")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — Megha's Wedding Planner" },
      { name: "description", content: "Photos and videos from every wedding function." },
      { property: "og:title", content: "Photo Gallery — Megha's Wedding Planner" },
      { property: "og:description", content: "Photos from every wedding function." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t } = useI18n();
  const { data } = useRows("gallery", { order: "created_at", asc: false });
  const save = useSaveRow("gallery", "Photo Gallery");
  const remove = useDeleteRow("gallery");
  const [fn, setFn] = useState("Mehendi");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    try {
      for (const file of files) {
        const url = await uploadFile(file, "gallery");
        save.mutate({ function_name: fn, file_url: url, file_type: file.type, caption: file.name });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const rows = (data ?? []).filter((g: any) => filter === "all" || g.function_name === filter);

  return (
    <div className="rise-in">
      <PageHeader title="Photo Gallery" subtitle="Memories from every function" />
      <div className="card-warm mb-4 flex flex-wrap items-center gap-3 p-4">
        <Select value={fn} onValueChange={setFn}>
          <SelectTrigger className="h-12 w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FUNCTION_NAMES.map((f) => <SelectItem key={f} value={f}>{t(f)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button asChild size="lg" disabled={busy}>
          <label className="cursor-pointer">
            <Upload className="mr-2 h-5 w-5" />{busy ? t("Saving") : t("Upload")}
            <Input type="file" multiple accept="image/*,video/*" className="hidden" onChange={onUpload} />
          </label>
        </Button>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-12 w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Everything")}</SelectItem>
            {FUNCTION_NAMES.map((f) => <SelectItem key={f} value={f}>{t(f)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((g: any) => (
          <figure key={g.id} className="card-warm group relative overflow-hidden p-0">
            {g.file_type?.startsWith("video") ? (
              <video src={g.file_url} controls className="h-40 w-full object-cover" />
            ) : (
              <img src={g.file_url} alt={g.caption ?? g.function_name} loading="lazy" className="h-40 w-full object-cover" />
            )}
            <figcaption className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
              <span className="truncate">{t(g.function_name)}</span>
              <span className="flex gap-1">
                <button onClick={() => save.mutate({ id: g.id, favourite: !g.favourite })} aria-label="Favourite">
                  <Heart className={"h-4 w-4 " + (g.favourite ? "fill-gold text-gold" : "")} />
                </button>
                <button onClick={() => remove.mutate(g)} aria-label="Delete">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {rows.length === 0 && <p className="text-muted-foreground">{t("Nothing here yet")}</p>}
    </div>
  );
}
