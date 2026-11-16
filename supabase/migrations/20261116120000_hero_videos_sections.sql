-- The same table now also drives the "Selected Work" strip; `section` says which one a row belongs to.
-- `key` may be a full https URL (the original Cloudinary reels) or an R2 object key.
alter table public.hero_videos
  add column section text not null default 'hero' check (section in ('hero', 'work'));

insert into public.hero_videos (section, title, key, sort_order) values
  ('work', 'Selected work 1', 'https://res.cloudinary.com/rzbfjedm/video/upload/v1786291247/V-Left_aos9au.mp4', 1),
  ('work', 'Selected work 2', 'https://res.cloudinary.com/rzbfjedm/video/upload/v1787044153/Sequence_07_1_ughkyp.mp4', 2),
  ('work', 'Selected work 3', 'https://res.cloudinary.com/rzbfjedm/video/upload/v1786976171/003_n5jph8.mp4', 3),
  ('work', 'Selected work 4', 'https://res.cloudinary.com/rzbfjedm/video/upload/v1787082909/004_kvnomx.mp4', 4),
  ('work', 'Selected work 5', 'https://res.cloudinary.com/rzbfjedm/video/upload/v1786291428/V-Right_dwxgbe.mp4', 5),
  ('work', 'Selected work 6', 'https://res.cloudinary.com/rzbfjedm/video/upload/v1785674816/002_d3dnts.mp4', 6);
