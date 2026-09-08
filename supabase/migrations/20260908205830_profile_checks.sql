-- Story 1.1 routes on "the row exists, therefore the profile is filled in". That was
-- true only by convention: not null lets first_name = '' through. These constraints
-- move the guarantee out of the app and into the database, so the sentence the router
-- relies on is enforced where it cannot be bypassed.

alter table public.profiles
  add constraint profiles_first_name_filled
    check (length(trim(first_name)) between 1 and 30);

-- Non-empty only, deliberately not check (city = 'lyon'): the list of open cities
-- lives in TypeScript (features/city/cities.ts), and pinning it here would make
-- opening the second city cost a migration.
alter table public.profiles
  add constraint profiles_city_filled
    check (length(trim(city)) > 0);

-- The same rule the storage policy already enforces on the object itself: a photo
-- lives in its owner's folder.
alter table public.profiles
  add constraint profiles_photo_path_owned
    check (starts_with(photo_path, id::text || '/'));

alter table public.profiles
  add constraint profiles_birthdate_plausible
    check (birthdate >= date '1900-01-01');

-- current_date inside a check: Postgres assumes check expressions are immutable and
-- warns that a dump/restore can fail if one changes result. Here it can only change
-- in one direction — nobody grows younger — so a row valid at insert stays valid
-- forever and the restore cannot break. The 18-year rule stops being a screen rule.
alter table public.profiles
  add constraint profiles_birthdate_adult
    check (birthdate <= (current_date - interval '18 years')::date);
