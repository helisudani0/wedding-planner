import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/seating")({
  head: () => ({
    meta: [
      { title: "Seating — Megha's Wedding Planner" },
      { name: "description", content: "Simple seating plan for each function" },
      { property: "og:title", content: "Seating — Megha's Wedding Planner" },
      { property: "og:description", content: "Simple seating plan for each function" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="planner_items"
      title="Seating"
      subtitle="Simple seating plan for each function"
      titleField="title"
      fields={[
        { name: "title", label: "Name" },
        { name: "group_name", label: "Section" },
        { name: "person", label: "Person" },
        { name: "item_date", label: "Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Not started", "In progress", "Ready"] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      kind="seating"
      groupField="group_name"
      order="sort_order"
    />
  );
}
