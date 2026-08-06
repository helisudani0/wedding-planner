import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { BRIDE_NAME } from "@/lib/wedding";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Family Sign In — Megha's Wedding Planner" },
      { name: "description", content: "Sign in to plan Megha's wedding together with the family." },
      { property: "og:title", content: "Family Sign In — Megha's Wedding Planner" },
      { property: "og:description", content: "Sign in to plan Megha's wedding together." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/home", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { name } },
        });
        if (error) throw error;
        if (!data.session) toast.success("Please check your email to confirm your account.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="card-warm floral-top w-full max-w-md p-7 rise-in">
        <div className="text-center">
          <Heart className="mx-auto h-9 w-9 text-gold" />
          <h1 className="mt-2 font-display text-4xl gold-text">{BRIDE_NAME}'s Wedding</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Family Wedding Planner — sign in to continue
          </p>
        </div>
        <div className="gold-rule my-5" />
        <form onSubmit={submit} className="space-y-4">
          {mode === "up" && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-base">Your Name</Label>
              <Input id="name" className="h-12" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input id="email" type="email" className="h-12" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input id="password" type="password" className="h-12" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" size="lg" className="h-14 w-full text-base" disabled={busy}>
            {mode === "in" ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-4 w-full text-sm text-muted-foreground underline underline-offset-4"
        >
          {mode === "in" ? "New family member? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
