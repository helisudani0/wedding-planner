import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/food")({
  head: () => ({
    meta: [
      { title: "Food Planner — Megha's Wedding Planner" },
      { name: "description", content: "Menu for every meal" },
      { property: "og:title", content: "Food Planner — Megha's Wedding Planner" },
      { property: "og:description", content: "Menu for every meal" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="planner_items"
      title="Food Planner"
      subtitle="Menu for every meal"
      titleField="title"
      fields={[
        { name: "title", label: "Name" },
        { name: "group_name", label: "Meal" },
        { name: "person", label: "Person" },
        { name: "item_date", label: "Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Not started", "In progress", "Ready"] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      kind="food"
      groupField="group_name"
      order="sort_order"
    />
  );
}
