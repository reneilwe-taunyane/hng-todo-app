import { useMemo, useState } from 'react'
import { FilterTabs } from './components/FilterTabs'
import { StatsBar } from './components/StatsBar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTasks'
import { PRIORITY_WEIGHT } from './types'
import type { Filter, Task } from './types'
import './App.css'

type SortMode = 'priority' | 'newest' | 'oldest'

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'priority', label: 'Priority' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
]

function sortTasks(tasks: Task[], mode: SortMode): Task[] {
  return [...tasks].sort((a, b) => {
    if (mode === 'priority') {
      const byPriority = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
      if (byPriority !== 0) return byPriority
      return b.createdAt - a.createdAt
    }
    return mode === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
  })
}

function App() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask, clearCompleted } = useTasks()
  const [filter, setFilter] = useState<Filter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('priority')

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks],
  )

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filter === 'active') return !task.completed
      if (filter === 'completed') return task.completed
      return true
    })
    return sortTasks(filtered, sortMode)
  }, [tasks, filter, sortMode])

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <div>
            <h1 className="brand__title">Taskly</h1>
            <p className="brand__subtitle">Plan your day, one task at a time.</p>
          </div>
        </div>

        <StatsBar
          total={counts.all}
          active={counts.active}
          completed={counts.completed}
        />
      </header>

      <main className="app__main">
        <TaskForm onAdd={addTask} />

        <div className="toolbar">
          <FilterTabs value={filter} onChange={setFilter} counts={counts} />

          <div className="toolbar__right">
            <div className="sort">
              <label className="sort__label" htmlFor="sort-mode">
                Sort by
              </label>
              <select
                id="sort-mode"
                className="sort__select"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {counts.completed > 0 && (
              <button type="button" className="button button--ghost" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        </div>

        <TaskList
          tasks={visibleTasks}
          totalCount={counts.all}
          filter={filter}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </main>

      <footer className="app__footer">
        <p>
          Saved locally in your browser — no account, no server. Your tasks stay
          private on this device.
        </p>
      </footer>
    </div>
  )
}

export default App
