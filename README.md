# Taskly — To-Do List

A polished, responsive to-do application built with **React 19 + TypeScript + Vite**.
Tasks are stored entirely in the browser with `localStorage`, so there is no backend,
no database and no account to create.

## Features

- **Create** tasks with a title, optional notes and a priority.
- **View** all tasks, split into clear *Active* and *Completed* sections.
- **Edit** any task inline — title, notes and priority.
- **Delete** any task, with an inline confirmation so nothing is removed by accident.
- **Complete** tasks with a single tap on the checkbox, and restore them the same way.
- **Notes** on every task, collapsed to a two line preview and expandable on demand.
- **Priority** (Low / Medium / High) shown as a colour coded badge and a coloured card
  edge, and sortable so the most urgent work surfaces first.
- **Filter** by All / Active / Completed, and sort by priority, newest or oldest.
- **Live summary** with total, active and completed counts plus a progress bar.
- **Clear completed** to tidy up in one action.
- **Persistence** — tasks, completion state, notes and priority all survive a refresh.
- **Light and dark** themes that follow the operating system setting.
- **Accessible** — labelled controls, `fieldset`/`legend` priority pickers, real
  `fieldset` semantics, visible focus rings, `aria-pressed` filter tabs, live regions
  for validation, and 24px minimum touch targets.
- **Resilient** — malformed or hand-edited `localStorage` data is validated and
  discarded rather than crashing the app, and open tabs stay in sync via the
  `storage` event.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check with tsc, then build for production
npm run preview  # preview the production build
npm run lint     # run oxlint
```

## Project structure

```
src/
├── types.ts                    # Task + Priority types and shared metadata
├── storage.ts                  # localStorage read/write with validation
├── hooks/
│   └── useTasks.ts             # All task state and CRUD actions
├── utils/
│   └── formatTimestamp.ts      # Human friendly relative timestamps
├── components/
│   ├── TaskForm.tsx            # Create form
│   ├── TaskItem.tsx            # A single task row
│   ├── TaskList.tsx            # Active/Completed sections + empty states
│   ├── EditTaskForm.tsx        # Inline edit form
│   ├── PrioritySelect.tsx      # Reusable radio group
│   ├── PriorityBadge.tsx       # Priority pill
│   ├── FilterTabs.tsx          # All / Active / Completed
│   ├── StatsBar.tsx            # Counts and progress bar
│   └── EmptyState.tsx          # Reusable empty state
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## How persistence works

`src/storage.ts` serialises tasks to `localStorage` under the key
`hng-todo-app:tasks:v1`. On load every record is validated field by field; entries
without a title are dropped and unknown priorities fall back to `medium`, so a
corrupted value can never break the app. The `useTasks` hook writes back on every
change and listens for the `storage` event to stay in sync across browser tabs.

## Data model

```ts
interface Task {
  id: string
  title: string
  notes: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: number
  updatedAt: number
  completedAt: number | null
}
```

## Browser support

Modern evergreen browsers. Tested in Chromium via the DevTools Protocol; layout
verified with no horizontal overflow from 320px to 1280px.
