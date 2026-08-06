import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Bell, Sun, Moon, Languages, LogOut, Search } from "lucide-react";
import { NAV, NAV_GROUPS, BRIDE_NAME } from "@/lib/wedding";
import { useI18n } from "@/lib/i18n";
import { useAuthUser } from "@/lib/useAuthUser";
import { supabase } from "@/integrations/supabase/client";
import { useRows } from "@/lib/db";
import { useApproval } from "@/lib/useApproval";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-5 pb-10">
      {NAV_GROUPS.map((group) => (
        <div key={group}>
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t(group)}
          </p>
          <ul className="space-y-1">
            {NAV.filter((n) => n.group === group).map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.98rem] transition-colors " +
                      (active
                        ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60")
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0 text-gold" />
                    <span className="truncate">{t(item.label)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const { displayName } = useAuthUser();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: notifications } = useRows("notifications", { order: "created_at", asc: false });
  const { loading: approvalLoading, approved } = useApproval();

  useEffect(() => {
    const stored = window.localStorage.getItem("theme") === "dark";
    setDark(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const unread = (notifications ?? []).filter((n: any) => !n.read).length;

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar px-3 py-5 lg:block">
        <Link to="/home" className="mb-5 block px-3">
          <p className="font-display text-2xl leading-tight gold-text">{BRIDE_NAME}</p>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {t("Family Wedding Planner")}
          </p>
        </Link>
        <div className="gold-rule mb-4" />
        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1">
          <NavLinks />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background/85 px-3 py-2.5 backdrop-blur sm:px-5">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[290px] overflow-y-auto bg-sidebar p-4">
              <SheetTitle className="font-display text-2xl gold-text">{BRIDE_NAME}</SheetTitle>
              <div className="gold-rule my-3" />
              <NavLinks onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link to="/search" className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            {t("Search")}
          </Link>

          <Button variant="ghost" size="icon" onClick={() => setLang(lang === "en" ? "gu" : "en")} aria-label="Language">
            <Languages className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Theme">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">
                    {unread}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-96 w-80 overflow-y-auto">
              <DropdownMenuLabel>Latest updates</DropdownMenuLabel>
              {(notifications ?? []).slice(0, 20).map((n: any) => (
                <DropdownMenuItem key={n.id} className="whitespace-normal text-sm">
                  {n.title}
                </DropdownMenuItem>
              ))}
              {(notifications ?? []).length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground">{t("Nothing here yet")}</p>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full px-3">
                {displayName}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate({ to: "/family" })}>
                {t("Family")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> {t("Sign out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-5 sm:px-6 sm:py-8">
          {approvalLoading ? null : approved ? (
            children
          ) : (
            <div className="card-warm floral-top mx-auto max-w-xl p-10 text-center">
              <p className="font-display text-3xl gold-text">{t("Almost there")}</p>
              <p className="mt-3 text-muted-foreground">
                {t("A family admin needs to approve your account before you can see the wedding plans.")}
              </p>
              <Button className="mt-6" size="lg" variant="outline" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> {t("Sign out")}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string | undefined;
  action?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">{t(title)}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{t(subtitle)}</p>}
      </div>
      {action}
    </div>
  );
}
