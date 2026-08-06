DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='storage' AND tablename='objects'
    AND policyname NOT LIKE 'wedding_files_family_%' LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "family_read_notifications" ON public.notifications;
DROP POLICY IF EXISTS "family_update_notifications" ON public.notifications;
DROP POLICY IF EXISTS "family_delete_notifications" ON public.notifications;
CREATE POLICY "notifications_read_own" ON public.notifications
  FOR SELECT TO authenticated
  USING (public.is_family(auth.uid()) AND (user_id IS NULL OR user_id = auth.uid()));
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE TO authenticated
  USING (public.is_family(auth.uid()) AND (user_id IS NULL OR user_id = auth.uid()))
  WITH CHECK (public.is_family(auth.uid()) AND (user_id IS NULL OR user_id = auth.uid()));
CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE TO authenticated
  USING (public.is_family(auth.uid()) AND (user_id IS NULL OR user_id = auth.uid()));

ALTER TABLE public.profiles DROP COLUMN IF EXISTS invite_token;