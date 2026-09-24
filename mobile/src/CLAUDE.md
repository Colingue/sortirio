Architecture rule

```
src/
  app/          routes only, no business logic
  features/     the product, grouped by topic
  components/   presentational, reused across features
  hooks/        generic, no product knowledge
  constants/    theme, static values
  lib/          technical
```

- One folder per topic, in product vocabulary: `auth/`, `profile/`, `routing/`.
- Name a file after its topic. Multiple functions per file, one
  topic per file.
- Rename when the content outgrows the name: `has-profile.ts` → `profile.ts`.
- `app/` imports `features/`. `features/` never imports `app/`.
- A feature importing another feature: ok once, suspect twice — extract
  the shared part into its own feature.
