import { createFileRoute, Link } from "@tanstack/react-router";
import { useRows, useSaveRow } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/wedding";

export const Route = createFileRoute("/_authenticated/today")({
  head: () => ({
    meta: [
      { title: "Today's Plan — Megha's Wedding Planner" },
      { name: "description", content: "Only what matters today: functions, tasks, shopping and payments." },
      { property: "og:title", content: "Today's Plan — Megha's Wedding Planner" },
      { property: "og:description", content: "Only what matters today." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const { t } = useI18n();
  const today = new Date().toISOString().slice(0, 10);
  const { data: events } = useRows("events", { order: "sort_order" });
  const { data: tasks } = useRows("tasks");
  const { data: expenses } = useRows("expenses");
  const saveTask = useSaveRow("tasks", "Tasks");

  const todayEvents = (events ?? []).filter((e: any) => e.event_date === today);
  const dueTasks = (tasks ?? []).filter(
    (x: any) => x.category !== "Shopping" && x.status !== "Completed" && x.due_date && x.due_date <= today,
  );
  const dueShopping = (tasks ?? []).filter(
    (x: any) => x.category === "Shopping" && x.status !== "Completed" && x.due_date && x.due_date <= today,
  );
  const duePayments = (expenses ?? []).filter((e: any) => !e.paid && e.due_date && e.due_date <= today);

  return (
    <div className="rise-in space-y-6">
      <PageHeader
        title="Today's Plan"
        subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        action={<Button asChild size="lg" variant="outline"><Link to="/live">{t("Live Mode")}</Link></Button>}
      />

      <section className="card-warm floral-top p-5">
        <h2 className="mb-3 font-display text-2xl">{t("Today's functions")}</h2>
        {todayEvents.length === 0 ? (
          <p className="text-muted-foreground">{t("No function today")}</p>
        ) : (
          <ul className="space-y-2">
            {todayEvents.map((e: any) => (
              <li key={e.id} className="rounded-xl bg-secondary/60 px-4 py-3">
                <p className="font-display text-2xl">{e.name}</p>
                <p className="text-sm text-muted-foreground">{e.event_time?.slice(0, 5)} • {e.venue ?? "—"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-warm p-5">
        <h2 className="mb-3 font-display text-2xl">{t("Today's work")}</h2>
        <ul className="space-y-2">
          {dueTasks.map((x: any) => (
            <li key={x.id} className="flex items-center gap-3 rounded-xl bg-secondary/60 px-4 py-3">
              <Checkbox
                className="h-6 w-6"
                checked={false}
                onCheckedChange={() => saveTask.mutate({ id: x.id, status: "Completed" })}
              />
              <span className="flex-1">{x.title}</span>
              <Badge variant={x.priority === "Urgent" ? "destructive" : "secondary"}>{t(x.priority)}</Badge>
            </li>
          ))}
          {dueTasks.length === 0 && <p className="text-muted-foreground">{t("All done for today")}</p>}
        </ul>
      </section>

      <section className="card-warm p-5">
        <h2 className="mb-3 font-display text-2xl">{t("Shopping today")}</h2>
        <ul className="space-y-2">
          {dueShopping.map((s: any) => (
            <li key={s.id} className="flex items-center gap-3 rounded-xl bg-secondary/60 px-4 py-3">
              <Checkbox
                className="h-6 w-6"
                checked={false}
                onCheckedChange={() => saveTask.mutate({ id: s.id, status: "Completed" })}
              />
              <span className="flex-1">{s.title}</span>
              <span className="text-sm text-muted-foreground">{s.list_name}</span>
            </li>
          ))}
          {dueShopping.length === 0 && <p className="text-muted-foreground">{t("Nothing here yet")}</p>}
        </ul>
      </section>

      <section className="card-warm p-5">
        <h2 className="mb-3 font-display text-2xl">{t("Payments due")}</h2>
        <ul className="space-y-2">
          {duePayments.map((e: any) => (
            <li key={e.id} className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
              <span>{e.title}</span>
              <span className="font-semibold">{inr(e.amount)}</span>
            </li>
          ))}
          {duePayments.length === 0 && <p className="text-muted-foreground">{t("Nothing here yet")}</p>}
        </ul>
      </section>
    </div>
  );
}
