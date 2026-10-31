-- Leads submitted through the website contact form (POST /api/contact).
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  phone text not null check (phone ~ '^\+\d{6,15}$'),
  brand_link text not null check (char_length(brand_link) between 1 and 300),
  package text not null check (package in ('starter', 'pro', 'machine')),
  budget text not null check (budget in ('1000-1500', '1500-3000', '3500-5000', '5000+')),
  message text not null check (char_length(message) between 1 and 5000)
);

comment on table public.contacts is 'Leads submitted through the website contact form.';

alter table public.contacts enable row level security;

-- The public site may only add leads; reading them is reserved for the dashboard / service role.
revoke all on table public.contacts from anon, authenticated;
grant insert on table public.contacts to anon;

create policy "website visitors can submit a lead"
  on public.contacts for insert to anon with check (true);
