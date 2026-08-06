import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — Megha's Wedding Planner" },
      { name: "description", content: "Important and emergency numbers" },
      { property: "og:title", content: "Contacts — Megha's Wedding Planner" },
      { property: "og:description", content: "Important and emergency numbers" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="contacts"
      title="Contacts"
      subtitle="Important and emergency numbers"
      titleField="name"
      fields={[
        { name: "name", label: "Name" },
        { name: "role", label: "Role" },
        { name: "phone", label: "Phone" },
        { name: "emergency", label: "Emergency", type: "bool" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      groupField="role"
      order="name"
    />
  );
}
