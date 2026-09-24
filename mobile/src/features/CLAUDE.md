Feature architecture

src/features/feature-name
|
+-- api # API calls
|
+-- components # React components scoped to this feature
|
+-- hooks # custom React hooks scoped to this feature
|
+-- helpers # pure functions grouped by domain within the feature
| # NOT one folder per function — one file per domain
|
+-- types # TypeScript types for the feature

Rules:

- helpers/: group by domain (date.ts, validation.ts), not 1 function = 1 file/folder.
- No imports between features (signup cannot import from availability) — move to shared if needed across features.
