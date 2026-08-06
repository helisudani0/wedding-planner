import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/return-gifts")({
  head: () => ({
    meta: [
      { title: "Return Gifts — Megha's Wedding Planner" },
      { name: "description", content: "Gifts to pack and give" },
      { property: "og:title", content: "Return Gifts — Megha's Wedding Planner" },
      { property: "og:description", content: "Gifts to pack and give" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="checklists"
      title="Return Gifts"
      subtitle="Gifts to pack and give"
      titleField="title"
      fields={[
        { name: "title", label: "Item" },
        { name: "group_name", label: "Group" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "assigned_to", label: "Assigned To" },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "done", label: "Done", type: "bool" },
      ]}
      kind="return_gift"
      groupField="group_name"
      doneField="done"
      order="sort_order"
    />
  );
}
