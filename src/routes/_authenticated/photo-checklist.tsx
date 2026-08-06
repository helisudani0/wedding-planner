import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/photo-checklist")({
  head: () => ({
    meta: [
      { title: "Photo Checklist — Megha's Wedding Planner" },
      { name: "description", content: "Photos we must not miss" },
      { property: "og:title", content: "Photo Checklist — Megha's Wedding Planner" },
      { property: "og:description", content: "Photos we must not miss" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="checklists"
      title="Photo Checklist"
      subtitle="Photos we must not miss"
      titleField="title"
      fields={[
        { name: "title", label: "Item" },
        { name: "group_name", label: "Group" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "assigned_to", label: "Assigned To" },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "done", label: "Done", type: "bool" },
      ]}
      kind="photo"
      groupField="group_name"
      doneField="done"
      order="sort_order"
    />
  );
}
