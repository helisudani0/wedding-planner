import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/_authenticated/music")({
  head: () => ({
    meta: [
      { title: "Music Playlist — Megha's Wedding Planner" },
      { name: "description", content: "Songs for every function" },
      { property: "og:title", content: "Music Playlist — Megha's Wedding Planner" },
      { property: "og:description", content: "Songs for every function" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <CollectionPage
      table="planner_items"
      title="Music Playlist"
      subtitle="Songs for every function"
      titleField="title"
      fields={[
        { name: "title", label: "Name" },
        { name: "group_name", label: "Playlist" },
        { name: "person", label: "Person" },
        { name: "item_date", label: "Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Not started", "In progress", "Ready"] },
        { name: "link_url", label: "Song Link" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      kind="music"
      groupField="group_name"
      order="sort_order"
    />
  );
}
