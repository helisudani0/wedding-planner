import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Megha's Wedding Planner" },
      { name: "description", content: "Who is doing what" },
      { property: "og:title", content: "Tasks — Megha's Wedding Planner" },
      { property: "og:description", content: "Who is doing what" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="tasks"
      title="Tasks"
      subtitle="Who is doing what"
      titleField="title"
      fields={[
        { name: "title", label: "Task" },
        { name: "assigned_to", label: "Assigned To" },
        { name: "due_date", label: "Due Date", type: "date" },
        { name: "priority", label: "Priority", type: "select", options: ["Urgent", "Normal", "Low"] },
        { name: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Completed"] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      groupField="status"
      groupOptions={["Pending", "In Progress", "Completed"]}
      order="due_date"
    />
  );
}
