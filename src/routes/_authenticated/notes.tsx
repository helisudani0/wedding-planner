import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Megha's Wedding Planner" },
      { name: "description", content: "Important notes for the family" },
      { property: "og:title", content: "Notes — Megha's Wedding Planner" },
      { property: "og:description", content: "Important notes for the family" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="notes"
      title="Notes"
      subtitle="Important notes for the family"
      titleField="title"
      fields={[
        { name: "title", label: "Title" },
        { name: "body", label: "Note", type: "textarea" },
        { name: "color", label: "Colour", type: "select", options: ["Urgent", "Pending", "Done"] },
        { name: "pinned", label: "Pinned", type: "bool" },
      ]}
      groupField="color"
    />
  );
}
