import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useRows, useSaveRow } from "@/lib/db";
import { useI18n } from "@/lib/i18n";
import { useAuthUser } from "@/lib/useAuthUser";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Family Chat — Megha's Wedding Planner" },
      { name: "description", content: "A simple chat for the family, inside the planner." },
      { property: "og:title", content: "Family Chat — Megha's Wedding Planner" },
      { property: "og:description", content: "A simple family chat inside the planner." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { t } = useI18n();
  const { user, displayName } = useAuthUser();
  const userId = user?.id ?? null;
  const { data } = useRows("messages", { order: "created_at" });
  const save = useSaveRow("messages", "Chat");
  const [text, setText] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    save.mutate({ body: text.trim(), sender_id: userId, sender_name: displayName });
    setText("");
  }

  return (
    <div className="rise-in flex h-[calc(100vh-9rem)] flex-col">
      <PageHeader title="Family Chat" subtitle="Talk to everyone at once" />
      <ul className="card-warm flex-1 space-y-2 overflow-y-auto p-4">
        {(data ?? []).map((m: any) => {
          const mine = m.sender_id === userId;
          return (
            <li key={m.id} className={mine ? "text-right" : ""}>
              <div
                className={
                  "inline-block max-w-[80%] rounded-2xl px-4 py-2 text-left " +
                  (mine ? "bg-primary text-primary-foreground" : "bg-secondary")
                }
              >
                {!mine && <p className="text-xs font-semibold opacity-70">{m.sender_name}</p>}
                <p className="whitespace-pre-wrap">{m.body}</p>
              </div>
            </li>
          );
        })}
        <div ref={bottom} />
      </ul>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <Input
          className="h-14 rounded-full"
          placeholder={t("Write a message")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" size="lg" className="rounded-full px-6">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
