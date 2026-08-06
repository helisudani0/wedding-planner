import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useRows } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/AppShell";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/search")({
  head: () => ({
    meta: [
      { title: "Search — Megha's Wedding Planner" },
      { name: "description", content: "Find any guest, task, shopping item, expense or provider instantly." },
      { property: "og:title", content: "Search — Megha's Wedding Planner" },
      { property: "og:description", content: "Find anything in the planner instantly." },
    ],
  }),
  component: SearchPage,
});

const SOURCES = [
  { table: "guests", label: "Guest List", to: "/guests", field: "name" },
  { table: "tasks", label: "Tasks", to: "/tasks", field: "title" },
  { table: "expenses", label: "Budget", to: "/budget", field: "title" },
  { table: "vendors", label: "Service Providers", to: "/providers", field: "name" },
  { table: "documents", label: "Documents", to: "/documents", field: "title" },
  { table: "checklists", label: "Checklists", to: "/checklist", field: "title" },
  { table: "planner_items", label: "Planners", to: "/dance", field: "title" },
] as const;

function SearchPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const results = SOURCES.map((s) => ({ source: s, rows: useSearch(s.table, s.field, q) }));
  const count = results.reduce((n, r) => n + r.rows.length, 0);

  return (
    <div className="rise-in">
      <PageHeader title="Search" subtitle="Find anything, anywhere" />
      <div className="relative mb-5">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          className="h-14 rounded-full pl-12 text-base"
          placeholder={t("Search")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {q && count === 0 && <p className="text-muted-foreground">{t("Nothing here yet")}</p>}
      <div className="space-y-5">
        {results
          .filter((r) => r.rows.length > 0)
          .map(({ source, rows }) => (
            <section key={source.table}>
              <h2 className="mb-2 font-display text-2xl">{t(source.label)}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {rows.slice(0, 12).map((row: any) => (
                  <li key={row.id} className="card-warm p-3">
                    <Link to={source.to} className="font-medium hover:underline">
                      {row[source.field]}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}

function useSearch(table: string, field: string, q: string) {
  const { data } = useRows(table);
  if (!q.trim()) return [];
  const needle = q.toLowerCase();
  return (data ?? []).filter((r: any) =>
    Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(needle)),
  ).filter((r: any) => r[field]);
}
