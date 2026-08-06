import { createFileRoute } from "@tanstack/react-router";
import { useRows, useSaveRow } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { useAuthUser } from "@/lib/useAuthUser";
import { PageHeader } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { inr, shareWhatsApp } from "@/lib/wedding";

export const Route = createFileRoute("/_authenticated/family")({
  head: () => ({
    meta: [
      { title: "Family — Megha's Wedding Planner" },
      { name: "description", content: "Every family member's work, shopping and expenses in one view." },
      { property: "og:title", content: "Family — Megha's Wedding Planner" },
      { property: "og:description", content: "Everyone's work and shopping in one view." },
    ],
  }),
  component: FamilyPage,
});

function FamilyPage() {
  const { t } = useI18n();
  const { displayName } = useAuthUser();
  const { data: profiles } = useRows("profiles", { order: "name" });
  const { data: tasks } = useRows("tasks");
  const { data: shopping } = useRows("shopping_items");
  const saveProfile = useSaveRow("profiles", "Family");

  function invite(p: any) {
    shareWhatsApp(
      `Namaste ${p.name}! Join our family wedding planner here: ${window.location.origin}/auth — sign in with your email ${p.email ?? ""}.`,
    );
  }

  return (
    <div className="rise-in">
      <PageHeader title="Family" subtitle={`Signed in as ${displayName}`} />
      <div className="grid gap-3 sm:grid-cols-2">
        {(profiles ?? []).map((p: any) => {
          const myTasks = (tasks ?? []).filter((x: any) => x.assigned_to === p.name);
          const myShopping = (shopping ?? []).filter((s: any) => s.assigned_to === p.name);
          const spend = myShopping.reduce((s: number, x: any) => s + Number(x.price ?? 0), 0);
          return (
            <section key={p.id} className="card-warm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-2xl">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.email ?? p.phone ?? "—"}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => invite(p)}>
                  <Share2 className="mr-1 h-4 w-4" /> {t("Invite")}
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{myTasks.filter((x: any) => x.status !== "Completed").length} {t("tasks left")}</Badge>
                <Badge variant="secondary">{myShopping.filter((s: any) => !s.bought).length} {t("items to buy")}</Badge>
                <Badge variant="secondary">{inr(spend)}</Badge>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {myTasks.slice(0, 4).map((x: any) => (
                  <li key={x.id}>• {x.title}</li>
                ))}
              </ul>
              {p.user_id && !p.approved && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="destructive">{t("Waiting for approval")}</Badge>
                  <Button size="sm" onClick={() => saveProfile.mutate({ id: p.id, approved: true })}>
                    {t("Approve")}
                  </Button>
                </div>
              )}
              {!p.is_active && (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => saveProfile.mutate({ id: p.id, is_active: true })}>
                  {t("Activate")}
                </Button>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
