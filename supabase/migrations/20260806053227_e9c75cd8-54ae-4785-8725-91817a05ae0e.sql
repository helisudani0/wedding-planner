ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false;
UPDATE public.profiles SET approved = true WHERE user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.is_family(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND approved = true AND is_active = true
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO existing FROM public.profiles
    WHERE user_id IS NULL AND lower(email) = lower(NEW.email) LIMIT 1;
  IF existing.id IS NOT NULL THEN
    UPDATE public.profiles SET user_id = NEW.id, approved = true, updated_at = now() WHERE id = existing.id;
  ELSE
    INSERT INTO public.profiles (user_id, name, email, approved)
    VALUES (COALESCE(NEW.id, NULL), COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@','1'::int)), NEW.email, false);
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role,'member'))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::public.app_role FROM public.profiles
WHERE email = 'helisudani1106@gmail.com' AND user_id IS NOT NULL
ON CONFLICT DO NOTHING;

DO $$
DECLARE t text; p record;
BEGIN
  FOREACH t IN ARRAY ARRAY['guests','contacts','expenses','vendors','budget_settings','activity_log',
    'catering','checklists','comments','documents','events','gallery','messages','notes',
    'planner_items','reminders','shopping_items','tasks','notifications']
  LOOP
    FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, t);
    END LOOP;
    EXECUTE format($f$CREATE POLICY "family_read_%1$s" ON public.%1$I FOR SELECT TO authenticated USING (public.is_family(auth.uid()))$f$, t);
    EXECUTE format($f$CREATE POLICY "family_insert_%1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.is_family(auth.uid()))$f$, t);
    EXECUTE format($f$CREATE POLICY "family_update_%1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.is_family(auth.uid())) WITH CHECK (public.is_family(auth.uid()))$f$, t);
    EXECUTE format($f$CREATE POLICY "family_delete_%1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.is_family(auth.uid()))$f$, t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_family" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_family(auth.uid()));

DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='storage' AND tablename='objects'
    AND policyname ILIKE '%wedding%' LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "wedding_files_family_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'wedding-files' AND public.is_family(auth.uid()));
CREATE POLICY "wedding_files_family_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'wedding-files' AND public.is_family(auth.uid()));
CREATE POLICY "wedding_files_family_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'wedding-files' AND public.is_family(auth.uid()));
CREATE POLICY "wedding_files_family_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'wedding-files' AND public.is_family(auth.uid()));