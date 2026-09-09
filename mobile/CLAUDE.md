# Rules for `mobile/`

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
- Inside a feature, the layout is fixed: `components/`, `helpers/`, `providers/`, one
  folder per file. Read `src/features/CLAUDE.md` before adding a file there.
- Name a file after its subject, kebab-case. Several functions per file, one subject
  per file.
- Rename when the content outgrows the name: `has-profile.ts` → `profile.ts`.
- Never `utils.ts`, `helpers.ts`, a barrel `index.ts`, or three unrelated functions in
  one file.
- `app/` imports `features/`. `features/` never imports `app/`.
- A feature importing another feature: fine once, suspicious twice — extract the shared
  piece into its own feature.

### Where a type goes

- Used in **one** place → in the file that uses it, next to what it describes.
- Used in **several** places → a `*.types.ts` at the smallest level that covers every
  user of it: the feature's folder if the feature is the only one, `src/` if not.
- Never a global `src/types/` bucket, never a `types/` folder inside a feature: a
  folder is named after a purpose, not after the nature of what it holds.

## Naming things

A name must say what the thing is or does, without the reader opening it.

- **Descriptive and unambiguous.** `next()` named the button, not the work. It is now
  `confirmCity()`, `confirmFirstName()`, `confirmBirthdate()` — three screens, three
  names, and no guessing which one you are reading.
- **Meaningful distinctions.** Two names in one scope differ by meaning, never by a
  digit or a filler word: not `city1` / `city2`, not `profile` / `profileData`.
- **Pronounceable and searchable.** If you cannot say it out loud, rename it. If
  grepping it returns noise, it is too short.
- **No encodings.** A name never carries its type: not `strCity`, not `arrCities`,
  not `IProfile`. TypeScript already knows.

A verb for a function, a noun for a value: `saveProfile()`, never `profileSave()` nor
`handleClick()`.

The linter helps but does not decide:

- `id-denylist` refuses a fixed list of empty names (`next`, `handler`, `res`, `str`…).
  Meet a new one → add it to the list in `eslint.config.js`.
- `id-length` refuses one-letter names.
- `naming-convention` refuses the `IProfile` shape.
- **Nothing** can check that a name is truly descriptive. That part is yours.
