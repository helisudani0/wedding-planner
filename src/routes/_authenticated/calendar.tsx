import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRows } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Megha's Wedding Planner" },
      { name: "description", content: "Monthly calendar of functions, shopping, payments and tasks." },
      { property: "og:title", content: "Calendar — Megha's Wedding Planner" },
      { property: "og:description", content: "Monthly view of everything planned." },
    ],
  }),
  component: CalendarPage,
});

type Dot = { label: string; tone: string };

export function CalendarPage() {
  const { t } = useI18n();
  const [cursor, setCursor] = useState(() => new Date());
  const { data: events } = useRows("events", { order: "sort_order" });
  const { data: tasks } = useRows("tasks");
  const { data: expenses } = useRows("expenses");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();

  const byDay = new Map<string, Dot[]>();
  const push = (date: string | null, dot: Dot) => {
    if (!date) return;
    byDay.set(date, [...(byDay.get(date) ?? []), dot]);
  };
  (events ?? []).forEach((e: any) => push(e.event_date, { label: e.name, tone: "bg-gold" }));
  (tasks ?? []).forEach((x: any) => {
    if (x.status === "Completed") return;
    const tone = x.category === "Shopping" ? "bg-emerald-500" : "bg-primary";
    push(x.due_date, { label: x.title, tone });
  });
  (expenses ?? []).forEach((e: any) => !e.paid && push(e.due_date, { label: e.title, tone: "bg-destructive" }));

  const cells = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  return (
    <div className="rise-in">
      <PageHeader
        title="Calendar"
        subtitle="Functions, shopping, payments and tasks"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="min-w-40 text-center font-display text-xl">
              {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        }
      />

      <div className="card-warm p-3 sm:p-5">
        <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-widest text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-1">{t(d)}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`p${i}`} />;
            const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dots = byDay.get(iso) ?? [];
            const isToday = iso === new Date().toISOString().slice(0, 10);
            return (
              <div
                key={iso}
                className={
                  "min-h-20 rounded-xl border border-border p-1.5 text-left " +
                  (isToday ? "bg-secondary" : "bg-card")
                }
              >
                <span className={"text-sm " + (isToday ? "font-bold text-gold" : "")}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {dots.slice(0, 3).map((d, j) => (
                    <p key={j} className="flex items-center gap-1 truncate text-[10px] text-muted-foreground">
                      <span className={"h-1.5 w-1.5 shrink-0 rounded-full " + d.tone} />
                      {d.label}
                    </p>
                  ))}
                  {dots.length > 3 && <p className="text-[10px] text-muted-foreground">+{dots.length - 3}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
