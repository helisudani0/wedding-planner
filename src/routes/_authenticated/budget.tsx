import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRows, useSaveRow, useDeleteRow, type Row } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { RecordDialog, type Field } from "@/components/CollectionPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EXPENSE_CATEGORIES, inr } from "@/lib/wedding";

const FIELDS: Field[] = [
  { name: "title", label: "What for" },
  { name: "category", label: "Category", type: "select", options: EXPENSE_CATEGORIES },
  { name: "amount", label: "Amount", type: "number" },
  { name: "amount_paid", label: "Amount Paid (advance / partial)", type: "number" },
  { name: "due_date", label: "Due Date", type: "date" },
  { name: "paid", label: "Paid", type: "bool" },
  { name: "paid_on", label: "Paid On", type: "date" },
  { name: "receipt_url", label: "Bill Link" },
  { name: "notes", label: "Notes", type: "textarea" },
];

export const Route = createFileRoute("/_authenticated/budget")({
  head: () => ({
    meta: [
      { title: "Budget — Megha's Wedding Planner" },
      { name: "description", content: "Total budget, money spent, money left and every bill." },
      { property: "og:title", content: "Budget — Megha's Wedding Planner" },
      { property: "og:description", content: "Total budget, money spent and money left." },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { t } = useI18n();
  const { data } = useRows("expenses", { order: "due_date" });
  const { data: settings } = useRows("budget_settings");
  const save = useSaveRow("expenses", "Budget");
  const saveBudget = useSaveRow("budget_settings", "Total Budget");
  const remove = useDeleteRow("expenses");
  const [editing, setEditing] = useState<Row | null>(null);

  const setting = (settings ?? [])[0];
  const total = Number(setting?.total_budget ?? 0);
  const rows = (data ?? []) as Row[];
  // Fully paid items count their full amount; unpaid items count whatever advance/partial has gone out so far.
  const spent = rows.reduce(
    (s, r) => s + (r.paid ? Number(r.amount ?? 0) : Number(r.amount_paid ?? 0)),
    0,
  );
  const pending = rows.filter((r) => !r.paid);
  const pendingTotal = pending.reduce(
    (s, r) => s + Math.max(0, Number(r.amount ?? 0) - Number(r.amount_paid ?? 0)),
    0,
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.category, (map.get(r.category) ?? 0) + Number(r.amount ?? 0)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [rows]);

  return (
    <div className="rise-in">
      <PageHeader
        title="Budget"
        subtitle="Every rupee, in one place"
        action={
          <Button size="lg" onClick={() => setEditing({ paid: false, category: "Miscellaneous" })}>
            <Plus className="mr-2 h-5 w-5" /> {t("Add")}
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="card-warm p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("Total Budget")}</p>
          <Input
            className="mt-1 h-12 border-0 bg-transparent px-0 font-display text-2xl shadow-none focus-visible:ring-0"
            type="number"
            defaultValue={total}
            onBlur={(e) =>
              saveBudget.mutate({ ...(setting ?? {}), total_budget: Number(e.target.value) })
            }
          />
        </div>
        <Card label="Money Spent" value={inr(spent)} />
        <Card label="Money Left" value={inr(Math.max(0, total - spent))} />
        <Card label="Upcoming Payments" value={inr(pendingTotal)} />
      </div>

      <div className="card-warm mt-4 p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>{t("Budget used")}</span>
          <span className="font-semibold">
            {total ? Math.min(100, Math.round((spent / total) * 100)) : 0}%
          </span>
        </div>
        <Progress value={total ? Math.min(100, (spent / total) * 100) : 0} className="h-4" />
        <div className="mt-4 flex flex-wrap gap-2">
          {byCategory.map(([c, v]) => (
            <Badge key={c} variant="secondary" className="rounded-full px-3 py-1 text-sm">
              {t(c)} — {inr(v)}
            </Badge>
          ))}
        </div>
      </div>

      <h2 className="mb-3 mt-7 font-display text-2xl">{t("Expense History")}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <li key={r.id} className="card-warm p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{r.title}</p>
                <p className="text-sm text-muted-foreground">
                  {t(r.category)} • {r.paid ? t("Paid") : `${t("Due")} ${r.due_date ?? "—"}`}
                  {!r.paid && Number(r.amount_paid ?? 0) > 0
                    ? ` • ${inr(Number(r.amount_paid))} ${t("advance paid")}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{inr(r.amount)}</span>
                <Button variant="ghost" size="icon" onClick={() => setEditing(r)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(r)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            {r.notes && <p className="mt-1 text-sm text-muted-foreground">{r.notes}</p>}
          </li>
        ))}
      </ul>

      <RecordDialog
        open={!!editing}
        row={editing}
        fields={FIELDS}
        title="Budget"
        onClose={() => setEditing(null)}
        onSave={(row) => {
          save.mutate(row);
          setEditing(null);
        }}
      />
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  const { t } = useI18n();
  return (
    <div className="card-warm p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{t(label)}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
