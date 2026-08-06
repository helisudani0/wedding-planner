import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { useRows, useSaveRow, type Row } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { RecordDialog, type Field } from "@/components/CollectionPage";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/wedding";

const FIELDS: Field[] = [
  { name: "name", label: "Function" },
  { name: "event_date", label: "Date", type: "date" },
  { name: "event_time", label: "Time", type: "time" },
  { name: "venue", label: "Venue" },
  { name: "responsible", label: "Person Responsible" },
  { name: "guest_count", label: "Guests", type: "number" },
  { name: "budget", label: "Budget", type: "number" },
  { name: "decoration_notes", label: "Decoration Notes", type: "textarea" },
  { name: "food_notes", label: "Food Notes", type: "textarea" },
  { name: "notes", label: "Notes", type: "textarea" },
  { name: "date_fixed", label: "Date Fixed", type: "bool" },
];

export const Route = createFileRoute("/_authenticated/schedule")({
  head: () => ({
    meta: [
      { title: "Wedding Schedule — Megha's Wedding Planner" },
      { name: "description", content: "Every function with date, time, venue and who is responsible." },
      { property: "og:title", content: "Wedding Schedule — Megha's Wedding Planner" },
      { property: "og:description", content: "Every function with date, time and venue." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const { t } = useI18n();
  const { data } = useRows("events", { order: "sort_order" });
  const save = useSaveRow("events", "Wedding Schedule");
  const [editing, setEditing] = useState<Row | null>(null);

  const rows = (data ?? []) as Row[];
  const dated = rows.filter((r) => r.date_fixed);
  const later = rows.filter((r) => !r.date_fixed);
  const days = Array.from(new Set(dated.map((r) => r.event_date)));

  return (
    <div className="rise-in">
      <PageHeader
        title="Wedding Schedule"
        subtitle="Everything in order, day by day"
        action={
          <Button size="lg" onClick={() => setEditing({ date_fixed: true })}>
            <Plus className="mr-2 h-5 w-5" /> {t("Add")}
          </Button>
        }
      />

      {days.map((day) => (
        <section key={day} className="mb-7">
          <h2 className="mb-3 font-display text-2xl gold-text">
            {new Date(day + "T00:00:00").toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>
          <ol className="relative space-y-3 border-l-2 border-gold/40 pl-5">
            {dated
              .filter((r) => r.event_date === day)
              .map((e) => (
                <li key={e.id} className="card-warm relative p-4">
                  <span className="absolute -left-[1.65rem] top-6 h-3 w-3 rounded-full bg-gold" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl">{e.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {e.event_time?.slice(0, 5)} {e.venue && `• ${e.venue}`}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setEditing(e)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {e.responsible && <div><dt className="inline font-medium text-foreground/70">{t("Person")}: </dt><dd className="inline">{e.responsible}</dd></div>}
                    {e.guest_count ? <div><dt className="inline font-medium text-foreground/70">{t("Guests")}: </dt><dd className="inline">{e.guest_count}</dd></div> : null}
                    {e.budget ? <div><dt className="inline font-medium text-foreground/70">{t("Budget")}: </dt><dd className="inline">{inr(e.budget)}</dd></div> : null}
                    {e.food_notes && <div className="col-span-2">🍽 {e.food_notes}</div>}
                    {e.decoration_notes && <div className="col-span-2">🌸 {e.decoration_notes}</div>}
                    {e.notes && <div className="col-span-2">📝 {e.notes}</div>}
                  </dl>
                </li>
              ))}
          </ol>
        </section>
      ))}

      {later.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-2xl">{t("Date not fixed yet")}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {later.map((e) => (
              <li key={e.id} className="card-warm flex items-center justify-between p-4">
                <span className="font-display text-xl">{e.name}</span>
                <Button variant="ghost" size="icon" onClick={() => setEditing(e)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RecordDialog
        open={!!editing}
        row={editing}
        fields={FIELDS}
        title="Wedding Schedule"
        onClose={() => setEditing(null)}
        onSave={(row) => {
          save.mutate(row);
          setEditing(null);
        }}
      />
    </div>
  );
}
