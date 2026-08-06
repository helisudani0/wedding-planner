import { createFileRoute } from "@tanstack/react-router";
import { useRows } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Megha's Wedding Planner" },
      { name: "description", content: "A full history of every change made by the family." },
      { property: "og:title", content: "Activity — Megha's Wedding Planner" },
      { property: "og:description", content: "History of every change made by the family." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const { t } = useI18n();
  const { data } = useRows("activity_log", { order: "created_at", asc: false });

  return (
    <div className="rise-in">
      <PageHeader title="Activity" subtitle="Who changed what, and when" />
      <ol className="card-warm space-y-3 p-5">
        {(data ?? []).map((a: any) => (
          <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2 last:border-0">
            <span>
              <span className="font-semibold">{a.actor_name}</span> {a.action}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(a.created_at).toLocaleString()}
            </span>
          </li>
        ))}
        {(data ?? []).length === 0 && <p className="text-muted-foreground">{t("Nothing here yet")}</p>}
      </ol>
    </div>
  );
}
