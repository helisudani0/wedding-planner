import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/jewellery")({
  head: () => ({
    meta: [
      { title: "Jewellery Planner — Megha's Wedding Planner" },
      { name: "description", content: "Who wears what, and where it is kept" },
      { property: "og:title", content: "Jewellery Planner — Megha's Wedding Planner" },
      { property: "og:description", content: "Who wears what, and where it is kept" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="planner_items"
      title="Jewellery Planner"
      subtitle="Who wears what, and where it is kept"
      titleField="title"
      fields={[
        { name: "title", label: "Name" },
        { name: "group_name", label: "Kept In" },
        { name: "person", label: "Person" },
        { name: "item_date", label: "Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Not started", "In progress", "Ready"] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      kind="jewellery"
      groupField="group_name"
      order="sort_order"
    />
  );
}
