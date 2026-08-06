import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/outfits")({
  head: () => ({
    meta: [
      { title: "Outfit Planner — Megha's Wedding Planner" },
      { name: "description", content: "Clothes, shoes and jewellery for everyone" },
      { property: "og:title", content: "Outfit Planner — Megha's Wedding Planner" },
      { property: "og:description", content: "Clothes, shoes and jewellery for everyone" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="planner_items"
      title="Outfit Planner"
      subtitle="Clothes, shoes and jewellery for everyone"
      titleField="title"
      fields={[
        { name: "title", label: "Name" },
        { name: "group_name", label: "Function" },
        { name: "person", label: "Person" },
        { name: "item_date", label: "Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Not started", "In progress", "Ready"] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      kind="outfit"
      groupField="group_name"
      order="sort_order"
    />
  );
}
