---
paths:
  - "mobile/src/**/*.tsx"
---

# React component files (`*.tsx`)

A `.tsx` file declares **one component and its styles. Nothing else.**

## No function beside the component

Never declare a function at the top level of a `.tsx` file, next to the component.

```tsx
function defaultBirthdate(today: Date): Date {
  return new Date(today.getFullYear() - DEFAULT_AGE, today.getMonth(), today.getDate());
}

export default function BirthdateScreen() { ... }
```

That function has nothing to do with rendering. It moves out:

- logic, data, a call to a server → `features/<subject>/helpers/<name>/<name>.ts`
- it needs React state shared between screens → `features/<subject>/providers/`
- it needs React but knows nothing of the product → `src/hooks/`

Then import it. The point is not tidiness: outside the component file, the function can be tested. `defaultBirthdate` is date arithmetic and had no test, only because of
where it sat.

## Functions inside the component stay

A function declared **inside** the component body is fine. It closes over state, props
and hooks — it cannot live anywhere else.

```tsx
export default function CityScreen() {
  const { update } = useSignupDraft();

  function confirmCity() {
    update({ city: city.id });
    router.push("/first-name");
  }
}
```

The test is one question: **does it use something from the component** — state, props,
a hook, a variable of the render?

- Yes → it stays inside the component.
- No → it does not belong to this file at all. Move it out.

## One component per file

**One file, one component.** A second component in the same file is a component that
has not been given its own file yet, whatever its size.

`photo.tsx` used to declare three: `PhotoScreen`, `Preview` and `Choices`. That is not
allowed. The two small ones moved out, and gained real names on the way —
`PhotoPreview` and `PhotoSourceButtons`.

Where the second one goes:

- Used by this feature only → `features/<subject>/components/<name>/<name>.tsx`
- Used by several features → `src/components/`
- It is a screen → `src/app/`, where routes are declared

Each moved component takes its own `StyleSheet.create` with it. A style shared by two
components is a sign they were never one thing.

`react/no-multi-comp` is on in `eslint.config.js`, so the linter refuses this one for
you: *Declare only one React component per file*.

## How to check before saving

Count the declarations at the top level of the file. **At most two**: the component,
and `const styles` when it has any. A third one has to move.
