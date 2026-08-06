
-- ROLES
CREATE TYPE public.app_role AS ENUM ('super_admin','admin','member');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  name text NOT NULL,
  phone text,
  email text,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  invite_token text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- link auth user to an existing invited profile by email, else create one
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO existing FROM public.profiles
    WHERE user_id IS NULL AND lower(email) = lower(NEW.email) LIMIT 1;
  IF existing.id IS NOT NULL THEN
    UPDATE public.profiles SET user_id = NEW.id, updated_at = now() WHERE id = existing.id;
  ELSE
    INSERT INTO public.profiles (user_id, name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), NEW.email);
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role,'member'))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- WEDDING FUNCTIONS
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_gu text,
  event_date date,
  event_time time,
  venue text,
  notes text,
  budget numeric DEFAULT 0,
  responsible text,
  guest_count integer DEFAULT 0,
  decoration_notes text,
  food_notes text,
  date_fixed boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  assigned_to text,
  due_date date,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  notes text,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  side text DEFAULT 'bride',
  family_name text,
  address text,
  invitation_given boolean NOT NULL DEFAULT false,
  card_printed boolean NOT NULL DEFAULT false,
  whatsapp_sent boolean NOT NULL DEFAULT false,
  reminder_sent boolean NOT NULL DEFAULT false,
  coming text DEFAULT 'maybe',
  guest_count integer NOT NULL DEFAULT 1,
  food_preference text DEFAULT 'veg',
  hotel_needed boolean NOT NULL DEFAULT false,
  transport_needed boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Miscellaneous',
  amount numeric NOT NULL DEFAULT 0,
  paid boolean NOT NULL DEFAULT false,
  due_date date,
  paid_on date,
  vendor_id uuid,
  receipt_url text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.budget_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_budget numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.shopping_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_name text NOT NULL DEFAULT 'Family',
  item_name text NOT NULL,
  price numeric DEFAULT 0,
  bought boolean NOT NULL DEFAULT false,
  shop_name text,
  assigned_to text,
  due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Caterer',
  phone text,
  address text,
  advance_paid numeric DEFAULT 0,
  remaining_payment numeric DEFAULT 0,
  next_payment_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.catering (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_date date,
  meal_name text NOT NULL,
  meal_type text NOT NULL DEFAULT 'Lunch',
  guest_count integer NOT NULL DEFAULT 0,
  menu text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- generic checklists: master, puja, packing, photography, return_gifts, emergency_kit
CREATE TABLE public.checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  group_name text,
  title text NOT NULL,
  title_gu text,
  done boolean NOT NULL DEFAULT false,
  quantity integer DEFAULT 1,
  extra text,
  assigned_to text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- generic planners: dance, music, outfit, jewellery, hotel, travel, seating, food
CREATE TABLE public.planner_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  group_name text,
  title text NOT NULL,
  person text,
  status text DEFAULT 'pending',
  link_url text,
  item_date date,
  notes text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  file_url text NOT NULL,
  file_type text,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  notes text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name text NOT NULL DEFAULT 'Wedding',
  file_url text NOT NULL,
  file_type text DEFAULT 'image',
  caption text,
  favourite boolean NOT NULL DEFAULT false,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  pinned boolean NOT NULL DEFAULT false,
  color text DEFAULT 'gold',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Family',
  phone text,
  notes text,
  emergency boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid,
  sender_name text NOT NULL,
  body text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  author_id uuid,
  author_name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_name text NOT NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  remind_on date NOT NULL,
  remind_time time,
  kind text NOT NULL DEFAULT 'custom',
  done boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- GRANTS + RLS for every table
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','user_roles','events','tasks','guests','expenses','budget_settings','shopping_items','vendors','catering','checklists','planner_items','documents','gallery','notes','contacts','messages','comments','notifications','activity_log','reminders']
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', t);
    IF t NOT IN ('user_roles','notifications') THEN
      EXECUTE format('CREATE POLICY "family read %1$s" ON public.%1$I FOR SELECT TO authenticated USING (true)', t);
      EXECUTE format('CREATE POLICY "family write %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (true)', t);
      EXECUTE format('CREATE POLICY "family update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)', t);
      EXECUTE format('CREATE POLICY "family delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (true)', t);
    END IF;
  END LOOP;

  FOREACH t IN ARRAY ARRAY['profiles','events','tasks','guests','expenses','budget_settings','shopping_items','vendors','catering','checklists','planner_items','documents','gallery','notes','contacts','reminders']
  LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at_%1$s BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t);
  END LOOP;
END $$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL) WITH CHECK (true);
CREATE POLICY "delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);

-- SEED DATA
INSERT INTO public.budget_settings (total_budget) VALUES (2500000);

INSERT INTO public.profiles (name, email, phone) VALUES
 ('Heli', NULL, NULL), ('Paresh', NULL, NULL), ('Urmila', NULL, NULL), ('Megha', NULL, NULL), ('Yashvi', NULL, NULL);

INSERT INTO public.events (name, name_gu, event_date, event_time, venue, date_fixed, sort_order) VALUES
 ('Mehendi','મહેંદી','2026-12-04','16:00',NULL,true,1),
 ('Geet','ગીત','2026-12-04','20:00',NULL,true,2),
 ('Mandap Muhurat','મંડપ મુહૂર્ત','2026-12-05','15:00',NULL,true,3),
 ('Haldi','હળદી','2026-12-05','17:00',NULL,true,4),
 ('Garba','ગરબા','2026-12-05','20:00',NULL,true,5),
 ('Mameru','મામેરું','2026-12-06','10:00',NULL,true,6),
 ('Jaan Arrival','જાન આગમન','2026-12-06','18:00',NULL,true,7),
 ('Wedding Ceremony','લગ્ન વિધિ','2026-12-06',NULL,NULL,true,8),
 ('Engagement','સગાઈ',NULL,NULL,NULL,false,9),
 ('Kankotri Lekhan','કંકોત્રી લેખન',NULL,NULL,NULL,false,10);

INSERT INTO public.catering (meal_date, meal_name, meal_type, guest_count) VALUES
 ('2026-12-05','5 December Lunch','Lunch',120),
 ('2026-12-05','5 December Dinner','Dinner',300),
 ('2026-12-06','6 December Wedding','Wedding Meal',700);

INSERT INTO public.checklists (kind, group_name, title, sort_order) VALUES
 ('master','Booking','Book venue',1),('master','Booking','Book photographer',2),('master','Booking','Book videographer',3),
 ('master','Booking','Book caterer',4),('master','Booking','Book decorator',5),('master','Booking','Book Pandit',6),
 ('master','Booking','Book DJ',7),('master','Booking','Book band and dhol',8),('master','Booking','Book makeup artist',9),
 ('master','Booking','Book mehendi artist',10),('master','Booking','Book hotel rooms',11),('master','Booking','Book vehicles',12),
 ('master','Booking','Book tent and sound system',13),('master','Booking','Book generator',14),
 ('master','Invitation','Finalise invitation design',15),('master','Invitation','Print invitation cards',16),
 ('master','Invitation','Write Kankotri',17),('master','Invitation','Distribute invitations',18),
 ('master','Invitation','Send WhatsApp invitations',19),('master','Invitation','Follow up for confirmations',20),
 ('master','Clothes','Buy bride outfits',21),('master','Clothes','Buy family outfits',22),('master','Clothes','Blouse fitting',23),
 ('master','Clothes','Tailor visit',24),('master','Clothes','Collect clothes from tailor',25),
 ('master','Jewellery','Buy jewellery',26),('master','Jewellery','Get jewellery cleaned',27),('master','Jewellery','Arrange locker or safe storage',28),
 ('master','Decoration','Stage decoration',29),('master','Decoration','Mandap decoration',30),('master','Decoration','Flowers',31),
 ('master','Decoration','Lighting',32),('master','Decoration','Entrance decoration',33),('master','Decoration','Rangoli',34),
 ('master','Function Items','Mehendi cones',35),('master','Function Items','Haldi items',36),('master','Function Items','Garba dandiya sticks',37),
 ('master','Function Items','Return gifts',38),('master','Function Items','Welcome drinks',39),
 ('master','Often Forgotten','Extension boards',40),('master','Often Forgotten','Water bottles',41),('master','Often Forgotten','First aid kit',42),
 ('master','Often Forgotten','Sewing kit',43),('master','Often Forgotten','Medicines',44),('master','Often Forgotten','Cash for small payments',45),
 ('master','Often Forgotten','QR code for payments',46),('master','Often Forgotten','Phone chargers and power banks',47),
 ('master','Often Forgotten','Umbrellas',48),('master','Often Forgotten','Spare footwear',49),('master','Often Forgotten','Safety pins',50),
 ('master','Documents','Marriage registration documents',51),('master','Documents','ID cards for all',52),('master','Documents','Vendor contracts',53),
 ('master','Payments','Pay vendor advances',54),('master','Payments','Plan final vendor payments',55),
 ('puja','Puja Items','Coconut',1),('puja','Puja Items','Rice',2),('puja','Puja Items','Flowers',3),('puja','Puja Items','Kalash',4),
 ('puja','Puja Items','Ghee',5),('puja','Puja Items','Camphor',6),('puja','Puja Items','Kumkum',7),('puja','Puja Items','Agarbatti',8),
 ('puja','Puja Items','Cotton wicks',9),('puja','Puja Items','Fruits',10),('puja','Puja Items','Supari',11),('puja','Puja Items','Haldi',12),
 ('puja','Puja Items','Mango leaves',13),('puja','Puja Items','Panchamrut',14),('puja','Puja Items','Diya',15),
 ('packing','Packing','Makeup',1),('packing','Packing','Jewellery',2),('packing','Packing','Clothes',3),('packing','Packing','Charger',4),
 ('packing','Packing','Power bank',5),('packing','Packing','Safety pins',6),('packing','Packing','Needle',7),('packing','Packing','Thread',8),
 ('packing','Packing','Cash',9),('packing','Packing','UPI ready on phone',10),('packing','Packing','Medicines',11),
 ('packing','Packing','Water bottle',12),('packing','Packing','Shoes',13),('packing','Packing','Dupatta',14),('packing','Packing','Phone',15),
 ('packing','Packing','Documents',16),
 ('photography','Bride','Bride getting ready',1),('photography','Bride','Bride with parents',2),('photography','Bride','Bride with sister',3),
 ('photography','Bride','Bride with grandparents',4),('photography','Bride','Bride solo portraits',5),
 ('photography','Functions','Mehendi close-ups',6),('photography','Functions','Geet performances',7),('photography','Functions','Haldi moments',8),
 ('photography','Functions','Garba dance',9),('photography','Functions','Mameru rituals',10),('photography','Functions','Jaan arrival',11),
 ('photography','Functions','Wedding rituals',12),('photography','Functions','Varmala',13),('photography','Functions','Vidaai',14),
 ('photography','Group','Full family photo',15),('photography','Group','Friends photo',16),('photography','Group','Reception stage photos',17),
 ('return_gifts','Return Gifts','Dry fruit boxes',1),('return_gifts','Return Gifts','Silver coins',2),('return_gifts','Return Gifts','Sweet boxes',3);

INSERT INTO public.planner_items (kind, group_name, title, person, status, sort_order) VALUES
 ('dance','Mehendi','Mehendi group dance',NULL,'pending',1),
 ('dance','Garba','Family garba performance',NULL,'pending',2),
 ('dance','Sister Dance','Sisters special dance','Yashvi','pending',3),
 ('music','Mehendi','Mehendi playlist',NULL,'pending',1),
 ('music','Garba','Garba playlist',NULL,'pending',2),
 ('music','Wedding','Wedding playlist',NULL,'pending',3),
 ('food','Lunch','5 December Lunch menu',NULL,'pending',1),
 ('food','Dinner','5 December Dinner menu',NULL,'pending',2),
 ('food','Wedding Meal','6 December Wedding menu',NULL,'pending',3),
 ('outfit','Bride','Megha wedding outfit','Megha','pending',1),
 ('jewellery','Bride','Bridal necklace set','Megha','pending',1),
 ('seating','VIP','VIP section',NULL,'pending',1),
 ('seating','Bride Side','Bride side seating',NULL,'pending',2),
 ('seating','Groom Side','Groom side seating',NULL,'pending',3);
