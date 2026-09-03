# Rules for `mobile/`

## No comments in code

Never write comments in the code — no `//`, no `/* */`, no JSDoc block, no TODO, no
section banner, no header explaining what a file does. This holds for TypeScript, TSX,
and config files alike.

The code says what it does on its own: name things so the intent is in the identifier,
extract a function instead of writing a sentence above a block, and let types carry the
contract. If a piece of code needs a sentence to be understood, rewrite the code.

## Where a file goes

Judge by the name, not the technology.

- Name talks about the product (profile, city, outing, session) → `src/features/<subject>/`
- Name talks about a tool (Supabase, storage, polyfill) → `src/lib/`
- Hesitating → `features/`. No business rule ever enters `lib/`.

```
src/
  app/          routes only, no business logic
  features/     the product, grouped by subject
  components/   presentational, reused across features
  hooks/        generic, no product knowledge
  constants/    theme, static values
  lib/          clients and technical setup
```

- One folder per subject, in the product's vocabulary: `auth/`, `profile/`, `routing/`.
- Keep files flat in a feature. Add sub-folders only when the folder stops scanning at
  a glance.
- Name a file after its subject, kebab-case. Several functions per file, one subject
  per file.
- Rename when the content outgrows the name: `has-profile.ts` → `profile.ts`.
- Never `utils.ts`, `helpers.ts`, a barrel `index.ts`, or three unrelated functions in
  one file.
- `app/` imports `features/`. `features/` never imports `app/`.
- A feature importing another feature: fine once, suspicious twice — extract the shared
  piece into its own feature.

### Pure logic stays pure

A function that only decides — no network, no React, no SDK — lives in its own
file and takes its inputs as arguments. `destinationFor({ session, hasProfile })`
is that shape: it can be tested without a server, and its test sits next to it as
`destination.test.ts`.
