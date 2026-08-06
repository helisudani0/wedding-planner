import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Row = any;

/** Read a whole table, kept live for everyone through realtime updates. */
export function useRows(table: string, opts?: { order?: string; asc?: boolean; kind?: string }) {
  const qc = useQueryClient();
  const key = ["t", table, opts?.kind ?? "all"];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      let q = supabase.from(table as any).select("*");
      if (opts?.kind) q = q.eq("kind", opts.kind);
      q = q.order(opts?.order ?? "created_at", { ascending: opts?.asc ?? true });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`live-${table}-${opts?.kind ?? "all"}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        qc.invalidateQueries({ queryKey: ["t", table] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [table, opts?.kind, qc]);

  return query;
}

async function logActivity(action: string, entityType: string, entityId?: string) {
  const { data } = await supabase.auth.getUser();
  const name =
    (data.user?.user_metadata?.["name"] as string) || data.user?.email?.split("@")[0] || "Someone";
  await supabase.from("activity_log").insert({
    actor_id: data.user?.id ?? null,
    actor_name: name,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
  });
  await supabase.from("notifications").insert({ user_id: null, title: name + " " + action });
}

export function useSaveRow(table: string, label = "Item") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Row) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from(table as any).update(rest).eq("id", id);
        if (error) throw error;
        await logActivity(`updated ${label.toLowerCase()} "${row["title"] ?? row["name"] ?? row["item_name"] ?? ""}"`, table, id);
        return id as string;
      }
      const { data, error } = await supabase.from(table as any).insert(rest).select("id").single();
      if (error) throw error;
      await logActivity(`added ${label.toLowerCase()} "${row["title"] ?? row["name"] ?? row["item_name"] ?? ""}"`, table, (data as any)?.id);
      return (data as any)?.id as string;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["t", table] });
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not save"),
  });
}

export function useDeleteRow(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase.from(table as any).delete().eq("id", row["id"]);
      if (error) throw error;
      return row;
    },
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["t", table] });
      toast.success("Deleted", {
        action: {
          label: "Undo",
          onClick: async () => {
            const { id, created_at, updated_at, ...rest } = row;
            await supabase.from(table as any).insert(rest);
            qc.invalidateQueries({ queryKey: ["t", table] });
          },
        },
      });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not delete"),
  });
}

export async function uploadFile(file: File, folder: string) {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const { error } = await supabase.storage.from("wedding-files").upload(path, file);
  if (error) throw error;
  const { data } = await supabase.storage.from("wedding-files").createSignedUrl(path, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? path;
}
