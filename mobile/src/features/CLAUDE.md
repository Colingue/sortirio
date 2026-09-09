# Rules for `src/features/`

## The shape of a feature

```
features/signup/
  components/   interface used inside this feature only
  helpers/      everything that is not interface
  providers/    state shared between screens
  ...
```

Create a folder the day a file needs it. An empty `components/` is noise.

## One folder per file

The file lives in a folder that carries its name, and its test lives there too.

```
features/signup/
  helpers/
    age/
      age.ts
      age.test.ts
    create-profile/
      create-profile.ts
  providers/
    signup-draft/
      signup-draft.tsx
```

## Choosing between the three

- **`components/`** — it renders interface, and only this feature uses it.
  Two features use it → `src/components/`.
  It is a screen → it stays in `src/app/`, where routes are declared.
- **`helpers/`** — a pure decision, a call to Supabase, a list of cities. Anything
  that is not a React element.
- **`providers/`** — a React context carrying state from one screen to the next.
  The provider and its hook come out of the same file.

## Naming

- kebab-case. The folder and the file carry the same name.
- The folder is called `helpers`; a file inside it never is. Never `utils.ts`,
  never `helpers.ts`, never a barrel `index.ts`.
- Name after the subject, not the shape: `age.ts`, not `age-utils.ts`.
- Rename the folder when the content outgrows the name.
