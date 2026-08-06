import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/lib/useAuthUser";

/** Is the signed-in person an approved family member? */
export function useApproval() {
  const { user, loading } = useAuthUser();
  const query = useQuery({
    queryKey: ["approval", user?.id ?? "none"],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, approved, is_active")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  return {
    loading: loading || (!!user?.id && query.isLoading),
    approved: !!query.data?.approved && !!query.data?.is_active,
    profile: query.data ?? null,
  };
}
