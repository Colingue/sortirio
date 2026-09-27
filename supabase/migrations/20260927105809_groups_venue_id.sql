-- "Exactly one venue per group" (US 3.2, requirement 2) is a column, not a join table:
-- a n-n link would say "zero or more" and would need a partial unique index to forbid
-- what a single column forbids for free. Same reasoning as the composite key on
-- group_members — the rule belongs to the schema, not to the job that fills it.
--
-- Nullable here on purpose. The next migration teaches the job to fill it; not null
-- arrives right after, once no code can produce a group without a venue. Adding the
-- constraint before the job knows about the column would break form_friday_groups()
-- between two migrations.
--
-- on delete restrict (the default, written out): a venue already handed to a group can
-- no longer be deleted by hand. Retiring a bar from the list is out of scope for this
-- story, and story 4.1's screen needs the name and address of past groups.

alter table public.groups
  add column venue_id uuid references public.venues (id) on delete restrict;
