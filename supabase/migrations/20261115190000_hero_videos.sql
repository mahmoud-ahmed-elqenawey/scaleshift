-- Videos shown in the home-page hero orbit, managed from /dashboard.
-- `key` is the object key inside the scaleshift-content R2 bucket.
create table public.hero_videos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null check (char_length(title) between 1 and 80),
  key text not null unique check (char_length(key) between 1 and 200),
  sort_order integer not null default 0
);

alter table public.hero_videos enable row level security;

-- The website reads the list anonymously; only the owner's dashboard account may change it.
grant select on table public.hero_videos to anon, authenticated;
grant insert, update, delete on table public.hero_videos to authenticated;

create policy "anyone can read hero videos"
  on public.hero_videos for select to anon, authenticated
  using (true);

create policy "dashboard owner can manage hero videos"
  on public.hero_videos for all to authenticated
  using ((auth.jwt() ->> 'email') = 'attwa.editor@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'attwa.editor@gmail.com');

-- Seed with the reels the hero shipped with, in their current order.
insert into public.hero_videos (title, key, sort_order) values
  ('Portfolio reel 001', 'portfolio/001.mp4', 1),
  ('Portfolio reel 002', 'portfolio/002.mp4', 2),
  ('Portfolio reel 003', 'portfolio/003.mp4', 3),
  ('Portfolio reel 004', 'portfolio/004.mp4', 4),
  ('Portfolio reel 005', 'portfolio/005.mp4', 5),
  ('Portfolio reel 006', 'portfolio/006.mp4', 6),
  ('Portfolio reel 007', 'portfolio/007.mp4', 7),
  ('Portfolio reel 008', 'portfolio/008.mp4', 8),
  ('Portfolio reel 009', 'portfolio/009.mp4', 9),
  ('Portfolio reel 010', 'portfolio/0010.mp4', 10);
