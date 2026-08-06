ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS amount_paid numeric NOT NULL DEFAULT 0;
