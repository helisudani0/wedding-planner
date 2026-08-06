# Wedding Planner

A family wedding planner — functions, guests, shopping, budget, and tasks in one place.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, SSR)
- [Supabase](https://supabase.com) (Postgres, Auth, Storage)
- Tailwind CSS + shadcn/ui components

## Setup

1. Install dependencies:
   ```sh
   npm i
   ```
2. Copy `.env.example` to `.env` and fill in your Supabase project's URL and publishable key (found in Supabase Dashboard → Project Settings → API).
3. Run the dev server:
   ```sh
   npm run dev
   ```

## Database

Schema and RLS policies live in `supabase/migrations/`. Apply them to your Supabase project via the Supabase CLI or dashboard SQL editor.

## Deployment

The app deploys to Vercel with zero extra config (it detects TanStack Start automatically). Set the same environment variables from `.env` in the Vercel project settings. Supabase remains the backend regardless of where the frontend is hosted — it isn't replaced by Vercel.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run format` — run Prettier
