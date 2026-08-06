import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/puja")({
  head: () => ({
    meta: [
      { title: "Puja Items — Megha's Wedding Planner" },
      { name: "description", content: "Everything needed for the pujas" },
      { property: "og:title", content: "Puja Items — Megha's Wedding Planner" },
      { property: "og:description", content: "Everything needed for the pujas" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="checklists"
      title="Puja Items"
      subtitle="Everything needed for the pujas"
      titleField="title"
      fields={[
        { name: "title", label: "Item" },
        { name: "group_name", label: "Group" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "assigned_to", label: "Assigned To" },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "done", label: "Done", type: "bool" },
      ]}
      kind="puja"
      groupField="group_name"
      doneField="done"
      order="sort_order"
    />
  );
}
