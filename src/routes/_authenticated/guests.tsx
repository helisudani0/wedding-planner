import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";
import { GuestImport } from "@/components/GuestImport";

export const Route = createFileRoute("/_authenticated/guests")({
  head: () => ({
    meta: [
      { title: "Guest List — Megha's Wedding Planner" },
      { name: "description", content: "Everyone we are inviting" },
      { property: "og:title", content: "Guest List — Megha's Wedding Planner" },
      { property: "og:description", content: "Everyone we are inviting" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="guests"
      title="Guest List"
      subtitle="Everyone we are inviting"
      titleField="name"
      fields={[
        { name: "name", label: "Name" },
        { name: "phone", label: "Phone" },
        { name: "side", label: "Side", type: "select", options: ["Bride Side", "Groom Side"] },
        { name: "family_name", label: "Family" },
        { name: "address", label: "Address", type: "textarea" },
        { name: "guest_count", label: "How Many", type: "number" },
        { name: "coming", label: "Coming", type: "select", options: ["Yes", "No", "Maybe"] },
        { name: "food_preference", label: "Food", type: "select", options: ["Veg", "Jain", "Vegan"] },
        { name: "invitation_given", label: "Invitation Given", type: "bool" },
        { name: "whatsapp_sent", label: "WhatsApp Sent", type: "bool" },
        { name: "hotel_needed", label: "Hotel Needed", type: "bool" },
        { name: "transport_needed", label: "Transport Needed", type: "bool" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      groupField="side"
      groupOptions={["Bride Side", "Groom Side"]}
      order="name"
      extraActions={<GuestImport />}
    />
  );
}
