import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/checklist")({
  head: () => ({
    meta: [
      { title: "Master Checklist — Megha's Wedding Planner" },
      { name: "description", content: "Every big and small wedding job in one list" },
      { property: "og:title", content: "Master Checklist — Megha's Wedding Planner" },
      { property: "og:description", content: "Every big and small wedding job in one list" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="checklists"
      title="Master Checklist"
      subtitle="Every big and small wedding job in one list"
      titleField="title"
      fields={[
        { name: "title", label: "Item" },
        { name: "group_name", label: "Group" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "assigned_to", label: "Assigned To" },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "done", label: "Done", type: "bool" },
      ]}
      kind="master"
      groupField="group_name"
      doneField="done"
      order="sort_order"
    />
  );
}
