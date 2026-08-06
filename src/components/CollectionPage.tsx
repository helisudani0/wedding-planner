import { useMemo, useState, type ReactNode } from "react";
import { Plus, Pencil, Trash2, Share2, Search as SearchIcon } from "lucide-react";
import { useRows, useSaveRow, useDeleteRow, type Row } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { shareWhatsApp } from "@/lib/wedding";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "date" | "time" | "select" | "bool";
  options?: string[];
  hideInList?: boolean;
};

export type CollectionProps = {
  table: string;
  title: string;
  subtitle?: string;
  fields: Field[];
  titleField: string;
  defaults?: Row;
  kind?: string;
  groupField?: string;
  groupOptions?: string[];
  order?: string;
  doneField?: string;
  extraActions?: ReactNode;
};

function fieldValue(row: Row, f: Field) {
  const v = row[f.name];
  if (v === null || v === undefined || v === "") return null;
  if (f.type === "bool") return v ? "Yes" : "No";
  return String(v);
}

export function CollectionPage(props: CollectionProps) {
  const { t } = useI18n();
  const { table, title, subtitle, fields, titleField, kind, groupField, doneField } = props;
  const { data, isLoading } = useRows(table, kind ? { order: props.order ?? "created_at", kind } : { order: props.order ?? "created_at" });
  const save = useSaveRow(table, title);
  const remove = useDeleteRow(table);

  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [editing, setEditing] = useState<Row | null>(null);
  const [confirm, setConfirm] = useState<Row | null>(null);

  const rows = useMemo(() => {
    let list = (data ?? []) as Row[];
    if (kind) list = list.filter((r) => r.kind === kind);
    if (group !== "all" && groupField) list = list.filter((r) => r[groupField] === group);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) =>
        Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q)),
      );
    }
    return list;
  }, [data, kind, group, groupField, query]);

  const groups = useMemo(() => {
    const set = new Set<string>(props.groupOptions ?? []);
    (data ?? []).forEach((r: Row) => {
      if (groupField && r[groupField]) set.add(r[groupField]);
    });
    return Array.from(set);
  }, [data, groupField, props.groupOptions]);

  function openNew() {
    const base: Row = { ...(props.defaults ?? {}) };
    if (kind) base.kind = kind;
    if (groupField && group !== "all") base[groupField] = group;
    setEditing(base);
  }

  function shareList() {
    const text =
      `*${t(title)}*\n\n` +
      rows
        .map((r, i) => `${i + 1}. ${r[titleField]}${doneField ? (r[doneField] ? " ✅" : "") : ""}`)
        .join("\n");
    shareWhatsApp(text);
  }

  return (
    <div className="rise-in">
      <PageHeader
        title={title}
        {...(subtitle ? { subtitle } : {})}
        action={
          <div className="flex flex-wrap gap-2">
            {props.extraActions}
            <Button variant="outline" size="lg" onClick={shareList}>
              <Share2 className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button size="lg" onClick={openNew}>
              <Plus className="mr-2 h-5 w-5" />
              {t("Add")}
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 rounded-full pl-9"
            placeholder={t("Search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {groupField && groups.length > 0 && (
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="h-12 w-48 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Everything")}</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g} value={g}>
                  {t(g)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="card-warm floral-top p-10 text-center">
          <p className="font-display text-2xl">{t("Nothing here yet")}</p>
          <Button className="mt-4" size="lg" onClick={openNew}>
            <Plus className="mr-2 h-5 w-5" /> {t("Add new")}
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <li key={row.id} className="card-warm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-xl leading-snug">{row[titleField]}</p>
                  {groupField && row[groupField] && (
                    <Badge variant="secondary" className="mt-1">
                      {t(row[groupField])}
                    </Badge>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  {doneField && (
                    <Switch
                      checked={!!row[doneField]}
                      onCheckedChange={(v) => save.mutate({ id: row.id, [doneField]: v })}
                      aria-label={t("Done")}
                    />
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setEditing(row)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setConfirm(row)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {fields
                  .filter((f) => f.name !== titleField && f.name !== groupField && !f.hideInList)
                  .map((f) => {
                    const v = fieldValue(row, f);
                    if (v === null) return null;
                    return (
                      <div key={f.name} className="truncate">
                        <dt className="inline font-medium text-foreground/70">{t(f.label)}: </dt>
                        <dd className="inline">{t(v)}</dd>
                      </div>
                    );
                  })}
              </dl>
            </li>
          ))}
        </ul>
      )}

      <RecordDialog
        open={!!editing}
        row={editing}
        fields={fields}
        title={title}
        onClose={() => setEditing(null)}
        onSave={(row) => {
          save.mutate(row);
          setEditing(null);
        }}
      />

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Delete")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.[titleField]} — this can be undone right after.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirm) remove.mutate(confirm);
                setConfirm(null);
              }}
            >
              {t("Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function RecordDialog({
  open,
  row,
  fields,
  title,
  onClose,
  onSave,
}: {
  open: boolean;
  row: Row | null;
  fields: Field[];
  title: string;
  onClose: () => void;
  onSave: (row: Row) => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<Row>({});
  const [initialised, setInitialised] = useState<Row | null>(null);

  if (open && row && initialised !== row) {
    setInitialised(row);
    setDraft({ ...row });
  }
  if (!open && initialised !== null) setInitialised(null);

  function set(name: string, value: unknown) {
    setDraft((d: Row) => ({ ...d, [name]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {draft["id"] ? t("Edit") : t("Add")} — {t(title)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name} className="text-base">
                {t(f.label)}
              </Label>
              {f.type === "textarea" ? (
                <Textarea
                  id={f.name}
                  value={draft[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              ) : f.type === "bool" ? (
                <div className="pt-1">
                  <Switch
                    id={f.name}
                    checked={!!draft[f.name]}
                    onCheckedChange={(v) => set(f.name, v)}
                  />
                </div>
              ) : f.type === "select" ? (
                <Select
                  value={draft[f.name] ?? ""}
                  onValueChange={(v) => set(f.name, v)}
                >
                  <SelectTrigger id={f.name} className="h-12">
                    <SelectValue placeholder={t("Add")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(f.options ?? []).map((o) => (
                      <SelectItem key={o} value={o}>
                        {t(o)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={f.name}
                  className="h-12"
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "time" ? "time" : "text"}
                  value={draft[f.name] ?? ""}
                  onChange={(e) =>
                    set(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" size="lg" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button size="lg" onClick={() => onSave(draft)}>
            {t("Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
