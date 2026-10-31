-- The /dashboard page signs in with Supabase Auth; only the owner's account may read leads.
grant select on table public.contacts to authenticated;

create policy "dashboard owner can read leads"
  on public.contacts for select to authenticated
  using ((auth.jwt() ->> 'email') = 'attwa.editor@gmail.com');
