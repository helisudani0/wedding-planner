import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { BRIDE_NAME } from "@/lib/wedding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Megha's Family Wedding Planner" },
      {
        name: "description",
        content:
          "A warm, simple planner for Megha's wedding — functions, guests, shopping, budget and tasks in one place.",
      },
      { property: "og:title", content: "Megha's Family Wedding Planner" },
      {
        property: "og:description",
        content: "Plan every function, guest, task and rupee together as a family.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home", replace: true });
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="max-w-xl text-center rise-in">
        <Heart className="mx-auto h-10 w-10 text-gold" />
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Family Wedding Planner
        </p>
        <h1 className="mt-3 font-display text-6xl leading-none gold-text sm:text-7xl">
          {BRIDE_NAME}
        </h1>
        <div className="gold-rule mx-auto my-6 max-w-xs" />
        <p className="text-lg text-muted-foreground">
          Every function, guest, shopping list, task and rupee — kept together for the whole
          family, in English and ગુજરાતી.
        </p>
        <Button asChild size="lg" className="mt-8 h-14 px-10 text-base">
          <Link to="/auth">Open the Planner</Link>
        </Button>
      </div>
    </div>
  );
}
