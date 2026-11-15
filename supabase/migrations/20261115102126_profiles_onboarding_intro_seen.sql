-- US2 (retours phase 1): whether the user went through the three intro screens. The
-- default does the backfill: every existing profile starts at false, so people already
-- signed up see the intro once too, same as a new profile. The app sets it to true
-- through the existing profiles_update_own policy.

alter table public.profiles
  add column onboarding_intro_seen boolean not null default false;
