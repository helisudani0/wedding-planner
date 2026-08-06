import { createFileRoute } from "@tanstack/react-router";
import { useRows } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { inr, EXPENSE_CATEGORIES } from "@/lib/wedding";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Megha's Wedding Planner" },
      { name: "description", content: "How much shopping, tasks, budget and guest replies are done." },
      { property: "og:title", content: "Progress — Megha's Wedding Planner" },
      { property: "og:description", content: "Colourful progress for the whole wedding." },
    ],
  }),
  component: ProgressPage,
});

function Line({ label, done, total, tone }: { label: string; done: number; total: number; tone: string }) {
  const { t } = useI18n();
  const value = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="card-warm p-5">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-display text-xl">{t(label)}</p>
        <p className="font-display text-3xl gold-text">{value}%</p>
      </div>
      <Progress value={value} className={"h-4 " + tone} />
      <p className="mt-2 text-sm text-muted-foreground">
        {done} / {total}
      </p>
    </div>
  );
}

function ProgressPage() {
  const { t } = useI18n();
  const { data: tasks } = useRows("tasks");
  const { data: guests } = useRows("guests");
  const { data: expenses } = useRows("expenses");
  const { data: checklists } = useRows("checklists");
  const { data: settings } = useRows("budget_settings", { order: "updated_at", asc: false });
  const shopping = (tasks ?? []).filter((x: any) => x.category === "Shopping");
  const nonShoppingTasks = (tasks ?? []).filter((x: any) => x.category !== "Shopping");

  const total = Number((settings ?? [])[0]?.total_budget ?? 0);
  // Same formula as the Budget page: fully paid items count in full, unpaid items count their advance.
  const spent = (expenses ?? []).reduce(
    (s: number, e: any) => s + (e.paid ? Number(e.amount ?? 0) : Number(e.amount_paid ?? 0)),
    0,
  );
  const byCat = EXPENSE_CATEGORIES.map((c) => ({
    c,
    v: (expenses ?? []).filter((e: any) => e.category === c).reduce((s: number, e: any) => s + Number(e.amount ?? 0), 0),
  })).filter((x) => x.v > 0);
  const max = Math.max(1, ...byCat.map((x) => x.v));

  return (
    <div className="rise-in">
      <PageHeader title="Progress" subtitle="How far along we are" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Line label="Shopping Completed" done={shopping.filter((s: any) => s.status === "Completed").length} total={shopping.length} tone="[&>div]:bg-emerald-500" />
        <Line label="Tasks Completed" done={nonShoppingTasks.filter((x: any) => x.status === "Completed").length} total={nonShoppingTasks.length} tone="[&>div]:bg-primary" />
        <Line label="Budget Used" done={spent} total={total || 1} tone="[&>div]:bg-gold" />
        <Line label="Guests Confirmed" done={(guests ?? []).filter((g: any) => g.coming === "Yes").length} total={(guests ?? []).length} tone="[&>div]:bg-sky-500" />
        <Line label="Invitations Given" done={(guests ?? []).filter((g: any) => g.invitation_given).length} total={(guests ?? []).length} tone="[&>div]:bg-amber-500" />
        <Line label="Checklists Done" done={(checklists ?? []).filter((c: any) => c.done).length} total={(checklists ?? []).length} tone="[&>div]:bg-rose-500" />
      </div>

      <h2 className="mb-3 mt-7 font-display text-2xl">{t("Spending by category")}</h2>
      <div className="card-warm space-y-3 p-5">
        {byCat.map(({ c, v }) => (
          <div key={c}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{t(c)}</span>
              <span className="font-semibold">{inr(v)}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gold" style={{ width: `${(v / max) * 100}%` }} />
            </div>
          </div>
        ))}
        {byCat.length === 0 && <p className="text-muted-foreground">{t("Nothing here yet")}</p>}
      </div>
    </div>
  );
}
