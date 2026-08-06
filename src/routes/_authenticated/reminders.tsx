import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — Megha's Wedding Planner" },
      { name: "description", content: "Things coming up soon" },
      { property: "og:title", content: "Reminders — Megha's Wedding Planner" },
      { property: "og:description", content: "Things coming up soon" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="reminders"
      title="Reminders"
      subtitle="Things coming up soon"
      titleField="title"
      fields={[
        { name: "title", label: "Reminder" },
        { name: "remind_on", label: "Date", type: "date" },
        { name: "remind_time", label: "Time", type: "time" },
        { name: "kind", label: "Type", type: "select", options: ["Function", "Shopping", "Payment", "Invitation", "Task"] },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "done", label: "Done", type: "bool" },
      ]}
      groupField="kind"
      doneField="done"
      order="remind_on"
    />
  );
}
