# AGENTS.md

Guidance for AI coding agents working in this repo. Plain Markdown, no required fields.

## Project Overview

**Taskly** — a client-side to-do list (HNG Stage 1 internship submission). Users create,
view, edit, complete and delete tasks; each task has optional notes and a priority
(Low / Medium / High). All data lives in `localStorage`.

**No backend, no database, no authentication, no network calls.** Do not add any.

- **Stack:** React 19.2, TypeScript ~6.0, Vite 8.3, oxlint 1.81.
- **No additional dependencies.** No state library, UI kit, icon package or CSS framework.
  Icons are inline SVG. If you think a package is required, justify it in your report
  instead of installing it.

## Setup Commands

```bash
npm install     # install dependencies
npm run dev     # dev server  -> http://localhost:5173
npm run build   # tsc -b && vite build  (the gate for "done")
npm run lint    # oxlint
npm run preview # serve the production build -> http://localhost:4173
```

No test runner is installed. See **Testing Instructions**.

## Project Structure

```
src/
├── types.ts        Task / Priority / Filter types + shared metadata
├── storage.ts      localStorage read+write, validation of untrusted data
├── hooks/useTasks.ts        single owner of task state and all CRUD
├── utils/formatTimestamp.ts relative timestamps
├── components/     presentational + reusable:
│                   TaskForm, EditTaskForm, TaskItem, TaskList,
│                   PrioritySelect, PriorityBadge, FilterTabs,
│                   StatsBar, EmptyState
├── App.tsx         view state (filter, sort) and composition only
├── App.css         all component styles
├── index.css       design tokens, reset, a11y utilities
└── main.tsx        React root — do not change
```

Layering: `components → hooks/useTasks → storage`. Components never touch
`localStorage`. `App.tsx` holds no task data.

## Code Style

- TypeScript only in `src/`. No `any`, no `@ts-ignore`, no `.js` files.
- 2-space indent, single quotes, no semicolons, trailing commas — match the file.
- Named exports everywhere except `App` (default export). One component per file.
- CSS: tokens live in `index.css`, component rules in `App.css`. Reuse custom
  properties (`--accent`, `--high`, `--text-muted`, `--radius-md`); no raw hex in `App.css`.
- Comments explain *why* only, never *what*.

### Compiler rules that fail the build

`tsconfig.app.json` enforces these — respect them rather than working around them:

- `erasableSyntaxOnly` — **no `enum`**, no parameter properties, no namespaces. Use an
  `as const` array plus a union type (see `PRIORITIES` in `types.ts`).
- `verbatimModuleSyntax` — type-only imports must use `import type { X } from '...'`.
- `noUnusedLocals`, `noUnusedParameters` — delete dead code; don't rename to `_`.
- `noFallthroughCasesInSwitch` — every `case` must break or return.
- `strict` is **not** enabled. Handle `null`/`undefined` explicitly anyway.

## Development Rules

- Read the whole file, plus `types.ts` and `storage.ts` when data is involved, before editing.
- Make the **smallest** change that solves the problem. This is graded work:
  unsolicited refactors, renames and restyling count as regressions.
- Do not change the design unless asked. Don't add unrequested features.
- `useTasks` is the only owner of task state. Don't mirror state into a component.
- When adding a task field, update `Task`, `toTask()` in `storage.ts` (so existing
  stored data still loads) and the validator — in the same change.
- Never delete or reconfigure the Vite setup: `vite.config.ts`, `tsconfig*.json`,
  `.oxlintrc.json`, `index.html`, `src/main.tsx`.

## Accessibility Requirements

Graded requirement. Do not regress.

- Every control needs a programmatic label: `htmlFor`/`id`, `<fieldset>` + `<legend>`
  (as `PrioritySelect` does), or `aria-label` on icon buttons. Icon-only buttons need
  `aria-label` **and** `title`.
- Never `outline: none` without a visible replacement. `:focus-visible` is styled
  globally in `index.css` — don't remove it.
- Touch targets **≥ 24 × 24 CSS px** (WCAG 2.2 SC 2.5.8).
- Contrast **≥ 4.5:1** for body text, **≥ 3:1** for text ≥ 24px (or ≥ 18.66px bold).
  Check light *and* dark mode. Composite `rgba()` against the parent before judging.
- Use `role="alert"` / `role="status"` for messages, `aria-expanded` for show/hide
  controls, `aria-pressed` for single-select toggles, `role="progressbar"` + `aria-valuenow`
  for progress. Decorative SVG gets `aria-hidden="true"`; screen-reader-only text uses `.sr-only`.
- Keep the `prefers-reduced-motion` handling and `color-scheme` declaration.

## Testing Instructions

No test runner is committed; adding one is out of scope. Verification means driving the
running app and asserting real behaviour. **Work is not complete until exercised.**

Test every feature you create or modify, and verify all of the following:

1. **Creation** — task renders and reaches `localStorage`; form resets; blank or
   whitespace-only title is rejected with a visible message.
2. **Viewing** — all tasks render; Active / Completed sections group correctly; empty
   state shows with no tasks and disappears once there are.
3. **Editing** — form opens pre-filled; title, notes and priority save; old value gone;
   changes persist; **Cancel discards without writing**.
4. **Deletion** — first click only asks to confirm; confirming click removes it; other
   tasks untouched; removal persists.
5. **Completion** — moves to the Completed section, updates counts and progress bar,
   sets `completedAt`; toggling back clears it.
6. **Notes** — add, view, expand/collapse, edit and clear; notes UI disappears when
   empty; notes persist.
7. **Priority** — Low, Medium, High each settable on create and changeable on edit;
   badge, card edge and stored value agree; default is Medium.
8. **localStorage persistence** — make changes, **reload the page**, confirm tasks,
   titles, notes, priority and completion status all survive.
9. **Filters** — All / Active / Completed show the right subset, `aria-pressed` updates,
   tab counts match reality, correct empty state shown.

How to test:

- Use **real mouse and keyboard input**, not only direct DOM calls. Scroll targets into
  view first and recompute coordinates after any action that re-renders or re-sorts.
- **One action per tick.** React batches updates, so several actions inside one JS task
  read stale state and produce false failures.
- Check 320, 390, 820, 1024 and 1280 px for horizontal scroll, clipped or overlapping
  content, and touch-target size.
- Check light and dark mode.
- Close leftover browser tabs between runs — they share `localStorage` and the app's
  cross-tab `storage` listener makes concurrent runs corrupt each other.
- If a check fails, establish whether the fault is in the app or the test **before**
  changing code. Report the root cause, not the symptom.

## Validation / Definition of Done

Run all of these after your final edit, from the project root:

```bash
npm run lint     # zero errors AND zero warnings
npm run build    # tsc -b && vite build — must exit 0
```

Then confirm the app still runs (`npm run dev`, or `npm run preview` after building) and
re-run the relevant items from **Testing Instructions**.

- **Fix every TypeScript error and every lint warning before finishing.** Do not
  suppress a rule, cast to silence it, or disable a check. Zero warnings is the bar.
- Never work around a failure by deleting tests, loosening a tsconfig flag, or
  commenting out code.
- If a failure is pre-existing and unrelated, say so and show evidence it predates
  your change.
- Final report must state: what you tested, which commands you ran, their results, and
  anything left unverified.

## Security / Data Rules

- One storage key: `hng-todo-app:tasks:v1`, defined once as `STORAGE_KEY` in
  `storage.ts`. Never hardcode the string elsewhere.
- Value is a JSON array of `Task`. All reads go through `loadTasks()`, which must keep
  validating: drop records with no `title`, coerce unknown priorities to the default,
  coerce missing timestamps to `Date.now()`.
- `localStorage` can hold anything — hand-edited JSON, `null`, invalid JSON, a
  non-array, an older shape. `loadTasks()` must never throw; it catches, warns, returns
  `[]`. **Keep it that way.**
- Persistence is handled by `useTasks` on every state change, skipping the initial
  mount read-back. Do not write to storage from a component.
- Keep the `storage` event listener that syncs tabs. Do not add a dependency for it.
- Any state that cannot survive a browser refresh is not finished.
- Store no secrets, tokens or personal data.
