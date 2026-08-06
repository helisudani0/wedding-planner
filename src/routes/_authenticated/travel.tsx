import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/travel")({
  head: () => ({
    meta: [
      { title: "Travel — Megha's Wedding Planner" },
      { name: "description", content: "Cars, drivers, pickups and parking" },
      { property: "og:title", content: "Travel — Megha's Wedding Planner" },
      { property: "og:description", content: "Cars, drivers, pickups and parking" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="planner_items"
      title="Travel"
      subtitle="Cars, drivers, pickups and parking"
      titleField="title"
      fields={[
        { name: "title", label: "Name" },
        { name: "group_name", label: "Type" },
        { name: "person", label: "Person" },
        { name: "item_date", label: "Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Not started", "In progress", "Ready"] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      kind="travel"
      groupField="group_name"
      order="sort_order"
    />
  );
}
