import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useRows } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/live")({
  head: () => ({
    meta: [
      { title: "Live Mode — Megha's Wedding Planner" },
      { name: "description", content: "Big and simple: the function happening now, what's next, and key numbers." },
      { property: "og:title", content: "Live Mode — Megha's Wedding Planner" },
      { property: "og:description", content: "The function happening now and key contacts." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const { t } = useI18n();
  const { data: events } = useRows("events", { order: "sort_order" });
  const { data: contacts } = useRows("contacts", { order: "name" });

  const now = new Date();
  const stamped = (events ?? [])
    .filter((e: any) => e.event_date)
    .map((e: any) => ({ ...e, at: new Date(`${e.event_date}T${e.event_time ?? "00:00"}`) }))
    .sort((a: any, b: any) => a.at - b.at);
  const next = stamped.find((e: any) => e.at >= now);
  const current = [...stamped].reverse().find((e: any) => e.at <= now);
  const key = (contacts ?? []).filter((c: any) => c.emergency).slice(0, 8);

  return (
    <div className="rise-in space-y-5">
      <h1 className="font-display text-4xl gold-text">{t("Live Mode")}</h1>

      <div className="card-warm floral-top p-7 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("Happening now")}</p>
        <p className="font-display text-5xl leading-tight">{current?.name ?? t("Nothing here yet")}</p>
        {current?.venue && <p className="mt-1 text-lg text-muted-foreground">{current.venue}</p>}
      </div>

      <div className="card-warm p-7 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("Next")}</p>
        <p className="font-display text-4xl leading-tight">{next?.name ?? "—"}</p>
        {next && (
          <p className="mt-1 text-lg text-muted-foreground">
            {next.event_date} • {next.event_time?.slice(0, 5)} {next.venue && `• ${next.venue}`}
          </p>
        )}
      </div>

      <h2 className="font-display text-2xl">{t("Key contacts")}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {key.map((c: any) => (
          <Button
            key={c.id}
            asChild
            size="lg"
            variant="outline"
            className="h-16 justify-between rounded-2xl text-base"
          >
            <a href={`tel:${c.phone ?? ""}`}>
              <span className="text-left">
                <span className="block font-semibold">{c.name}</span>
                <span className="block text-sm text-muted-foreground">{c.role}</span>
              </span>
              <Phone className="h-5 w-5 text-gold" />
            </a>
          </Button>
        ))}
        {key.length === 0 && <p className="text-muted-foreground">{t("Nothing here yet")}</p>}
      </div>
    </div>
  );
}
