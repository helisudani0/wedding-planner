import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/hotel")({
  head: () => ({
    meta: [
      { title: "Hotel Rooms — Megha's Wedding Planner" },
      { name: "description", content: "Rooms, guests and check in times" },
      { property: "og:title", content: "Hotel Rooms — Megha's Wedding Planner" },
      { property: "og:description", content: "Rooms, guests and check in times" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="planner_items"
      title="Hotel Rooms"
      subtitle="Rooms, guests and check in times"
      titleField="title"
      fields={[
        { name: "title", label: "Name" },
        { name: "group_name", label: "Hotel" },
        { name: "person", label: "Person" },
        { name: "item_date", label: "Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Not started", "In progress", "Ready"] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      kind="hotel"
      groupField="group_name"
      order="sort_order"
    />
  );
}
