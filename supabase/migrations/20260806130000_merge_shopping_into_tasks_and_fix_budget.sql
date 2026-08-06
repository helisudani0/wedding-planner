-- Merge Shopping into Tasks (shopping is a kind of task) and remove the
-- standalone Food Planner (Catering already covers meals/menus).
-- Also fix Budget so "Total Budget" reliably saves and "Money Left" updates.

-- 1) Extend tasks with the fields shopping items used to have.
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS list_name text,
  ADD COLUMN IF NOT EXISTS price numeric,
  ADD COLUMN IF NOT EXISTS shop_name text;

-- 2) Carry over any existing shopping_items rows into tasks so nothing is lost.
INSERT INTO public.tasks (title, category, list_name, price, shop_name, assigned_to, due_date, status, notes, created_at, updated_at)
SELECT
  s.item_name,
  'Shopping',
  s.list_name,
  s.price,
  s.shop_name,
  s.assigned_to,
  s.due_date,
  CASE WHEN s.bought THEN 'Completed' ELSE 'Pending' END,
  s.notes,
  s.created_at,
  s.updated_at
FROM public.shopping_items s
WHERE NOT EXISTS (
  SELECT 1 FROM public.tasks t WHERE t.category = 'Shopping' AND t.title = s.item_name
);

-- 3) Fix Budget: "budget_settings" is meant to hold exactly one row, but the
-- app could insert a fresh row instead of updating the existing one whenever
-- the settings hadn't finished loading yet, so "Total Budget" looked like it
-- never saved (the UI kept reading the oldest/blank row). Collapse to a
-- single row, keeping the most recently updated one, and make sure one exists.
DELETE FROM public.budget_settings
WHERE id NOT IN (
  SELECT id FROM public.budget_settings ORDER BY updated_at DESC, id DESC LIMIT 1
);

INSERT INTO public.budget_settings (total_budget)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM public.budget_settings);
