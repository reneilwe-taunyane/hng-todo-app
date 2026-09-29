# AGENTS.md — Taskly (HNG Stage 1 To-Do App)

Guidance for AI coding agents working in this repository. Read this before changing anything.

## 1. Project overview

**Taskly** is a client-side to-do list. Users create, view, edit, complete and delete
tasks; each task carries optional notes and a priority (Low / Medium / High). All data
is stored in `localStorage` — there is **no backend, no database, no authentication and
no network calls of any kind**.

The product brief is an internship submission, so code quality, accessibility and a
working, verifiable build matter as much as the features themselves.

## 2. Technology stack

| Layer | Choice | Version |
|---|---|---|
| UI | React + React DOM | 19.2 |
| Language | TypeScript | ~6.0 |
| Build / dev server | Vite | 8.3 |
| Linting | oxlint | 1.81 |

- **Do not add dependencies.** Everything required is already present. If you believe a
  new package is necessary, stop and justify it in your final report instead.
- Only React built-ins are used. No state library, no UI kit, no icon package, no CSS
  framework. Icons are inline SVG.

### Commands

```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # tsc -b && vite build  — the gate for "done"
npm run lint     # oxlint
npm run preview  # serve the production build (default http://localhost:4173)
```

## 3. Project structure

```
src/
├── types.ts                  Task, Priority, Filter types + shared metadata
├── storage.ts                localStorage read/write, validation, sanitisation
├── hooks/
│   └── useTasks.ts           single source of task state and all CRUD actions
├── utils/
│   └── formatTimestamp.ts    "Today, 9:41 AM" / "3d ago"
├── components/               presentational, reusable
│   ├── TaskForm.tsx          create form
│   ├── EditTaskForm.tsx      inline edit form
│   ├── TaskItem.tsx          one task row
│   ├── TaskList.tsx          Active / Completed sections + empty states
│   ├── PrioritySelect.tsx    fieldset + radio group (shared by create and edit)
│   ├── PriorityBadge.tsx     priority pill
│   ├── FilterTabs.tsx        All / Active / Completed
│   ├── StatsBar.tsx          counts + progress bar
│   └── EmptyState.tsx        reusable empty state
├── App.tsx                   view state (filter, sort) + composition only
├── App.css                   all component styles
├── index.css                 design tokens, reset, a11y utilities
└── main.tsx                  React root (do not change)
```

Layering: `components → hooks/useTasks → storage`. Components never touch
`localStorage` directly. `App.tsx` holds no task data.

## 4. Coding conventions

- **TypeScript everywhere.** No `any`. No `@ts-ignore`. No `.js` files in `src/`.
- **Enforced by `tsconfig.app.json`** — the build fails on these:
  - `noUnusedLocals`, `noUnusedParameters` — remove dead code, do not rename to `_`.
  - `erasableSyntaxOnly` — **no `enum`**, no parameter properties, no namespaces.
    Use `as const` arrays plus a union type (see `PRIORITIES` in `types.ts`).
  - `verbatimModuleSyntax` — type-only imports **must** use `import type { X }`.
  - `noFallthroughCasesInSwitch` — every `case` must break or return.
  - `strict` is **not** enabled. Do not assume strict null checks are catching things;
    handle `null`/`undefined` explicitly anyway.
- 2-space indent, single quotes, semicolons omitted, trailing commas in multiline
  literals — match the surrounding file.
- Named exports for everything except `App`, which stays a default export.
- One component per file, colocated in `components/`.
- Prefer a small reusable component over duplicated markup. `PrioritySelect` and
  `EmptyState` exist for exactly this reason.
- No comments explaining *what* code does. Only comment non-obvious *why*.
- CSS: tokens in `index.css`, component rules in `App.css`. Reuse existing custom
  properties (`--accent`, `--high`, `--text-muted`, `--radius-md`); do not hardcode
  hex values in `App.css`.

## 5. Rules for modifying existing features

1. Read the whole file, plus `types.ts` and `storage.ts` if data is involved, before editing.
2. Make the **smallest** change that fixes the problem. This is a graded submission;
   unsolicited refactors, renames or restyling count as regressions.
3. Do not change the visual design unless the task requires it. Match existing spacing,
   colour and radius conventions.
4. Do not add features that were not asked for. No new dependencies, no analytics, no
   themes beyond light/dark, no routing.
5. Keep `useTasks` as the only owner of task state. Do not duplicate tasks into
   component state or `useEffect` mirrors of state.
6. Never delete or reconfigure the Vite setup (`vite.config.ts`, `tsconfig*.json`,
   `.oxlintrc.json`, `index.html`, `src/main.tsx`).
7. When adding a task field, update the `Task` interface, `toTask()` in `storage.ts`
   (so old stored data still loads), and the validator in the same change.

## 6. Accessibility requirements

Accessibility is a graded requirement, not a nice-to-have. Do not regress any of it.

- Every control has a **programmatic** label: `htmlFor`/`id`, a `<fieldset>` +
  `<legend>` (as `PrioritySelect` does), or `aria-label` for icon buttons.
- Icon-only buttons need `aria-label` **and** `title`.
- No `outline: none` without a visible replacement focus ring. `:focus-visible` is
  styled globally in `index.css` — do not remove it.
- Touch targets are **at least 24 × 24 CSS px** (WCAG 2.2 SC 2.5.8). `.task__checkbox`
  and `.task__notes-toggle` were both fixed up for this; check any new control.
- Text contrast **≥ 4.5:1**, or **≥ 3:1** for text ≥ 24px (or ≥ 18.66px bold). Check
  both light and dark mode. Semi-transparent backgrounds (`rgba`) must be composited
  against the parent before judging.
- Status and validation messages use `role="alert"` or `role="status"`.
- Toggles that show/hide content use `aria-expanded`; single-select groups use
  `aria-pressed`; progress uses `role="progressbar"` with `aria-valuenow`.
- Decorative SVG gets `aria-hidden="true"`; decorative text for screen readers uses
  `.sr-only`.
- Do not remove `prefers-reduced-motion` handling or the skip from `color-scheme`.

## 7. localStorage and data persistence

- One key only: **`hng-todo-app:tasks:v1`**, defined once as `STORAGE_KEY` in
  `storage.ts`. Never hardcode the string elsewhere.
- The value is a JSON array of `Task`. Every read goes through `loadTasks()`, which
  **must** keep validating: drop records without a `title`, coerce unknown priorities
  to the default, and coerce missing timestamps to `Date.now()`.
- `localStorage` can contain anything — hand-edited JSON, `null`, invalid JSON, a
  non-array, or data from an older shape. `loadTasks()` must never throw; it catches,
  warns and returns `[]`. **Keep it that way.**
- Writes are debounced by React state, not manual. `useTasks` persists on every change
  and skips the initial mount read-back via the `isFirstRender` ref — do not "fix" this
  by writing to storage inside a component.
- `useTasks` also listens for the `storage` event so tabs stay in sync. Do not remove
  the listener, and do not add a dependency for it.
- Every state change (create, edit, complete, un-complete, delete, clear completed)
  must survive a browser refresh. If a feature cannot survive a refresh, it is not done.
- Never store secrets, tokens or personal data. There is no auth layer and none is needed.

## 8. Testing requirements

**There is no committed test runner** (no Vitest/Jest/Playwright) and adding one is out
of scope. Verification means driving the running app and asserting on real behaviour.
Work is not complete until it has been exercised.

Before reporting done, every feature you created or modified must be exercised, and all
of the following must be verified to work:

1. **Task creation** — add a task, confirm it renders and lands in `localStorage`; the
   form resets; a blank or whitespace-only title is rejected with a visible message.
2. **Viewing** — all tasks render; Active and Completed sections group correctly; the
   empty state appears when there are no tasks and disappears once there are.
3. **Editing** — the edit form opens pre-filled, saves title/notes/priority, the old
   value disappears, changes persist, and **Cancel discards** without writing.
4. **Deletion** — one click asks for confirmation and deletes nothing; the confirming
   click removes the task; other tasks are untouched; the removal persists.
5. **Completion** — toggling moves the task into the Completed section, updates the
   counts and progress bar, sets `completedAt`, and toggling back clears it.
6. **Notes** — add notes, view them on the card, expand/collapse them, edit them,
   clear them, and confirm the notes UI disappears when empty. Notes must persist.
7. **Priority** — Low, Medium and High can each be set on create and changed on edit;
   badge, card edge and stored value agree; the default is Medium.
8. **localStorage persistence** — make changes, **reload the page**, and confirm
   tasks, titles, notes, priority and completion status all survive.
9. **Filters** — All / Active / Completed show the right subset, `aria-pressed`
   updates, the tab counts match reality, and the correct empty state is shown.

Rules for how to test:

- Exercise the **real UI** (genuine mouse and keyboard input), not only direct DOM
  manipulation. Clicks must be scrolled into view first, and coordinates must be
  recomputed after every action that re-renders or re-sorts the list.
- Never drive several actions inside a single JavaScript task. React batches updates,
  so a batched click sees stale state and produces false failures. One action per tick,
  with a short wait.
- Check **320, 390, 820, 1024 and 1280 px** widths for horizontal scrolling, clipped
  or overlapping content, and touch-target size. Fix anything that is clipped.
- Test both **light and dark** colour schemes.
- Close leftover browser tabs between runs. They share `localStorage`, and the app's
  cross-tab `storage` listener will otherwise make independent runs corrupt each other.
- If a check fails, determine whether the defect is in the app or in the test before
  changing any code. Report the root cause, not the symptom.

## 9. Validation requirements

Run all three, in the project root, after your final edit. **A change is not complete
until the production build succeeds.**

```bash
npm run lint     # must report zero errors and zero warnings
npm run build    # tsc -b && vite build — must exit 0
```

Then verify the app still runs (`npm run dev`, or `npm run preview` after a build) and
re-run the relevant tests from section 8.

- **Fix every TypeScript error and every lint warning before finishing.** Do not
  suppress, disable a rule, or cast to silence them. Zero warnings is the bar.
- Never work around a failure by deleting tests, loosening a tsconfig flag, or
  commenting out code.
- If a build failure is pre-existing and unrelated to your change, say so explicitly
  and show evidence that it predates the work.
- State clearly in your final report: which features were tested, which validation
  commands were run, their results, and anything left unverified.
