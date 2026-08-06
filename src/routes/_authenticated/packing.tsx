import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/packing")({
  head: () => ({
    meta: [
      { title: "Packing List — Megha's Wedding Planner" },
      { name: "description", content: "What to pack for each function" },
      { property: "og:title", content: "Packing List — Megha's Wedding Planner" },
      { property: "og:description", content: "What to pack for each function" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="checklists"
      title="Packing List"
      subtitle="What to pack for each function"
      titleField="title"
      fields={[
        { name: "title", label: "Item" },
        { name: "group_name", label: "Group" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "assigned_to", label: "Assigned To" },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "done", label: "Done", type: "bool" },
      ]}
      kind="packing"
      groupField="group_name"
      doneField="done"
      order="sort_order"
    />
  );
}
