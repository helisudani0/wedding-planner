import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Users,
  Wallet,
  ShoppingBag,
  ListChecks,
  Plus,
  Bell,
  Camera,
} from "lucide-react";
import { useRows } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { useAuthUser } from "@/lib/useAuthUser";
import { PageHeader } from "@/components/AppShell";
import { inr, WEDDING_DATE, BRIDE_NAME } from "@/lib/wedding";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function daysLeft() {
  const ms = new Date(WEDDING_DATE).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}

function pct(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Home — Megha's Wedding Planner" },
      { name: "description", content: "Countdown, today's work, budget and everything at a glance." },
      { property: "og:title", content: "Home — Megha's Wedding Planner" },
      { property: "og:description", content: "Countdown, today's work and everything at a glance." },
    ],
  }),
  component: HomePage,
});

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const { t } = useI18n();
  return (
    <div className="card-warm p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{t(label)}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{t(hint)}</p>}
    </div>
  );
}

function HomePage() {
  const { t } = useI18n();
  const { displayName } = useAuthUser();
  const { data: events } = useRows("events", { order: "sort_order" });
  const { data: tasks } = useRows("tasks");
  const { data: guests } = useRows("guests");
  const { data: expenses } = useRows("expenses");
  const { data: shopping } = useRows("shopping_items");
  const { data: budget } = useRows("budget_settings");
  const { data: notes } = useRows("notes");
  const { data: activity } = useRows("activity_log", { order: "created_at", asc: false });

  const today = new Date().toISOString().slice(0, 10);
  const openTasks = (tasks ?? []).filter((x: any) => x.status !== "Completed");
  const todayTasks = openTasks.filter((x: any) => x.due_date && x.due_date <= today);
  const spent = (expenses ?? []).filter((e: any) => e.paid).reduce((s: number, e: any) => s + Number(e.amount ?? 0), 0);
  const upcomingPayments = (expenses ?? []).filter((e: any) => !e.paid);
  const upcomingTotal = upcomingPayments.reduce((s: number, e: any) => s + Number(e.amount ?? 0), 0);
  const total = Number((budget ?? [])[0]?.total_budget ?? 0);
  const guestHeads = (guests ?? []).reduce((s: number, g: any) => s + Number(g.guest_count ?? 1), 0);
  const bought = (shopping ?? []).filter((s: any) => s.bought).length;
  const upcoming = (events ?? [])
    .filter((e: any) => e.event_date && e.event_date >= today)
    .slice(0, 4);

  return (
    <div className="rise-in space-y-6">
      <PageHeader
        title={`Namaste, ${displayName}`}
        subtitle={new Date().toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      />

      <div className="card-warm floral-top p-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          {t("Days to")} {BRIDE_NAME}'s {t("Wedding")}
        </p>
        <p className="font-display text-7xl leading-none gold-text">{daysLeft()}</p>
        <div className="gold-rule mx-auto my-4 max-w-xs" />
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild size="lg"><Link to="/today"><Plus className="mr-2 h-4 w-4" />{t("Today's Plan")}</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/tasks"><ListChecks className="mr-2 h-4 w-4" />{t("Tasks")}</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/shopping"><ShoppingBag className="mr-2 h-4 w-4" />{t("Shopping")}</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/guests"><Users className="mr-2 h-4 w-4" />{t("Guest List")}</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/gallery"><Camera className="mr-2 h-4 w-4" />{t("Photo Gallery")}</Link></Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Guests" value={String(guestHeads)} hint={`${(guests ?? []).length} families`} />
        <Stat label="Money Spent" value={inr(spent)} hint={total ? `of ${inr(total)}` : "Set a total budget"} />
        <Stat label="Upcoming Payments" value={inr(upcomingTotal)} hint={`${upcomingPayments.length} pending`} />
        <Stat label="Tasks Left" value={String(openTasks.length)} hint={`${todayTasks.length} due today`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-warm p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-2xl">
            <CalendarDays className="h-5 w-5 text-gold" /> {t("Upcoming functions")}
          </h2>
          <ul className="space-y-2">
            {upcoming.map((e: any) => (
              <li key={e.id} className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
                <span className="font-medium">{e.name}</span>
                <span className="text-sm text-muted-foreground">
                  {e.event_date} {e.event_time?.slice(0, 5)}
                </span>
              </li>
            ))}
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">{t("Nothing here yet")}</p>}
          </ul>
        </section>

        <section className="card-warm p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-2xl">
            <ListChecks className="h-5 w-5 text-gold" /> {t("Today's work")}
          </h2>
          <ul className="space-y-2">
            {todayTasks.slice(0, 6).map((x: any) => (
              <li key={x.id} className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
                <span>{x.title}</span>
                <Badge variant={x.priority === "Urgent" ? "destructive" : "secondary"}>{t(x.priority)}</Badge>
              </li>
            ))}
            {todayTasks.length === 0 && <p className="text-sm text-muted-foreground">{t("All done for today")}</p>}
          </ul>
        </section>

        <section className="card-warm p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-2xl">
            <Wallet className="h-5 w-5 text-gold" /> {t("Progress")}
          </h2>
          <div className="space-y-3">
            <Bar label="Shopping done" value={pct(bought, (shopping ?? []).length)} />
            <Bar label="Tasks done" value={pct((tasks ?? []).length - openTasks.length, (tasks ?? []).length)} />
            <Bar label="Budget used" value={total ? Math.min(100, Math.round((spent / total) * 100)) : 0} />
            <Bar
              label="Guests confirmed"
              value={pct((guests ?? []).filter((g: any) => g.coming === "Yes").length, (guests ?? []).length)}
            />
          </div>
        </section>

        <section className="card-warm p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-2xl">
            <Bell className="h-5 w-5 text-gold" /> {t("Latest updates")}
          </h2>
          <ul className="space-y-1.5 text-sm">
            {(activity ?? []).slice(0, 6).map((a: any) => (
              <li key={a.id} className="text-muted-foreground">
                <span className="font-medium text-foreground">{a.actor_name}</span> {a.action}
              </li>
            ))}
            {(activity ?? []).length === 0 && <p className="text-sm text-muted-foreground">{t("Nothing here yet")}</p>}
          </ul>
          {(notes ?? []).filter((n: any) => n.pinned).length > 0 && (
            <>
              <div className="gold-rule my-4" />
              <h3 className="mb-2 font-display text-xl">{t("Important notes")}</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {(notes ?? []).filter((n: any) => n.pinned).map((n: any) => (
                  <li key={n.id}>• {n.title}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const { t } = useI18n();
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{t(label)}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <Progress value={value} className="h-3" />
    </div>
  );
}
