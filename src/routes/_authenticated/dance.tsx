import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/dance")({
  head: () => ({
    meta: [
      { title: "Dance Planner — Megha's Wedding Planner" },
      { name: "description", content: "Performances, songs and practice days" },
      { property: "og:title", content: "Dance Planner — Megha's Wedding Planner" },
      { property: "og:description", content: "Performances, songs and practice days" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="planner_items"
      title="Dance Planner"
      subtitle="Performances, songs and practice days"
      titleField="title"
      fields={[
        { name: "title", label: "Name" },
        { name: "group_name", label: "Function" },
        { name: "person", label: "Person" },
        { name: "item_date", label: "Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Not started", "In progress", "Ready"] },
        { name: "link_url", label: "Song Link" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      kind="dance"
      groupField="group_name"
      order="sort_order"
    />
  );
}
