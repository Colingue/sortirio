# Rules for `supabase/`

Backend choices are settled in `docs/adr/2026-08-31-backend-supabase.md`.

## Migrations

- A migration contains **only the columns the code of the same commit reads or writes**.
  Columns a future story needs arrive in that story's migration.
- Think an exception is worth it? Say so **before** writing the SQL, not afterwards in
  the commit message.
- One migration per change, created with `npx supabase migration new <name>`.
- Never edit a migration that has been pushed. Write a new one.
- Never change the schema by hand in the dashboard — environments drift.

## Secrets

- The mobile app holds the anon key and nothing else. A `service_role` key never leaves
  the server.

## Commands

```bash
npx supabase migration new <name>
npx supabase db reset       # replay migrations + seed, locally
npx supabase db push        # apply to the hosted project
```
