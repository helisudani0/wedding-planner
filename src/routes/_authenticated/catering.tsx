import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/catering")({
  head: () => ({
    meta: [
      { title: "Catering — Megha's Wedding Planner" },
      { name: "description", content: "Meals and guest counts" },
      { property: "og:title", content: "Catering — Megha's Wedding Planner" },
      { property: "og:description", content: "Meals and guest counts" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="catering"
      title="Catering"
      subtitle="Meals and guest counts"
      titleField="meal_name"
      fields={[
        { name: "meal_name", label: "Meal" },
        { name: "meal_type", label: "Type", type: "select", options: ["Breakfast", "Lunch", "Snacks", "Dinner", "Wedding Meal"] },
        { name: "meal_date", label: "Date", type: "date" },
        { name: "guest_count", label: "Guests", type: "number" },
        { name: "menu", label: "Menu", type: "textarea" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      groupField="meal_type"
      order="meal_date"
    />
  );
}
