import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";
import { SHOPPING_LISTS } from "@/lib/wedding";

export const Route = createFileRoute("/_authenticated/shopping")({
  head: () => ({
    meta: [
      { title: "Shopping — Megha's Wedding Planner" },
      { name: "description", content: "Separate lists for everyone" },
      { property: "og:title", content: "Shopping — Megha's Wedding Planner" },
      { property: "og:description", content: "Separate lists for everyone" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="shopping_items"
      title="Shopping"
      subtitle="Separate lists for everyone"
      titleField="item_name"
      fields={[
        { name: "item_name", label: "Item" },
        { name: "list_name", label: "List", type: "select", options: SHOPPING_LISTS },
        { name: "price", label: "Price", type: "number" },
        { name: "shop_name", label: "Shop" },
        { name: "assigned_to", label: "Assigned To" },
        { name: "due_date", label: "Buy By", type: "date" },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "bought", label: "Bought", type: "bool" },
      ]}
      groupField="list_name"
      groupOptions={SHOPPING_LISTS}
      doneField="bought"
    />
  );
}
