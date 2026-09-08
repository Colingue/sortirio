-- Record 2026-09-08-no-gender-in-profile: the gender leaves the profile entirely —
-- not asked at sign-up, not stored, not used. The column was written by nobody
-- (story 1.1 only reads whether the row exists), so dropping it breaks no code.

alter table public.profiles drop column gender;
