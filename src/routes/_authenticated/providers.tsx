import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";
import { VENDOR_CATEGORIES } from "@/lib/wedding";

export const Route = createFileRoute("/_authenticated/providers")({
  head: () => ({
    meta: [
      { title: "Service Providers — Megha's Wedding Planner" },
      { name: "description", content: "Caterer, decorator, photographer and more" },
      { property: "og:title", content: "Service Providers — Megha's Wedding Planner" },
      { property: "og:description", content: "Caterer, decorator, photographer and more" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="vendors"
      title="Service Providers"
      subtitle="Caterer, decorator, photographer and more"
      titleField="name"
      fields={[
        { name: "name", label: "Name" },
        { name: "category", label: "Type", type: "select", options: VENDOR_CATEGORIES },
        { name: "phone", label: "Phone" },
        { name: "address", label: "Address" },
        { name: "advance_paid", label: "Advance Paid", type: "number" },
        { name: "remaining_payment", label: "Remaining", type: "number" },
        { name: "next_payment_date", label: "Next Payment", type: "date" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      groupField="category"
      groupOptions={VENDOR_CATEGORIES}
      order="name"
    />
  );
}
