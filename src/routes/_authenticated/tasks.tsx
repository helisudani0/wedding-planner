import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";
import { TASK_CATEGORIES, SHOPPING_LISTS } from "@/lib/wedding";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Megha's Wedding Planner" },
      { name: "description", content: "Who is doing what, including shopping" },
      { property: "og:title", content: "Tasks — Megha's Wedding Planner" },
      { property: "og:description", content: "Who is doing what, including shopping" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="tasks"
      title="Tasks"
      subtitle="Who is doing what, including shopping"
      titleField="title"
      defaults={{ category: "General", status: "Pending", priority: "Normal" }}
      fields={[
        { name: "title", label: "Task" },
        { name: "category", label: "Category", type: "select", options: TASK_CATEGORIES },
        { name: "list_name", label: "Shopping List", type: "select", options: SHOPPING_LISTS },
        { name: "assigned_to", label: "Assigned To" },
        { name: "due_date", label: "Due Date", type: "date" },
        { name: "priority", label: "Priority", type: "select", options: ["Urgent", "Normal", "Low"] },
        { name: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Completed"] },
        { name: "price", label: "Price (for shopping items)", type: "number" },
        { name: "shop_name", label: "Shop (for shopping items)" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      groupField="status"
      groupOptions={["Pending", "In Progress", "Completed"]}
      order="due_date"
    />
  );
}
