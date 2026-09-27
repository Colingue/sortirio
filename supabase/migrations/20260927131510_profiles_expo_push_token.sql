-- US 3.3: where the device's Expo push token lives. A column on profiles rather than a
-- table of its own, because the story is explicit: one profile, one token, the last one
-- seen (requirement 1). A 1-1 relation is a column. It also costs nothing in RLS — the
-- app writes it through the existing profiles_update_own policy, and the Thursday job
-- reads it the way it already reads profiles.city.
--
-- The column is nullable, and that is a deliberate break of this table's "every column
-- is not null" rule. Requirement 3 says a profile with no token — permission refused, or
-- never asked — is a normal state, not a half-written row, so not null is impossible
-- here. The alternative, a push_tokens table where absence is an absent row, keeps the
-- invariant at the price of a table and its policies for a single text value.
--
-- The check refuses anything that is not an Expo token: the only writer is the app, and
-- a wrong value here is silently un-notifiable at 19h on Thursday, never an error.

alter table public.profiles
  add column expo_push_token text
    check (expo_push_token is null or starts_with(expo_push_token, 'ExponentPushToken['));
