import type { Filter, Task } from '../types'
import { EmptyState } from './EmptyState'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  totalCount: number
  filter: Filter
  onToggle: (id: string) => void
  onUpdate: (id: string, changes: { title: string; notes: string; priority: Task['priority'] }) => void
  onDelete: (id: string) => void
}

export function TaskList({
  tasks,
  totalCount,
  filter,
  onToggle,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (totalCount === 0) {
    return (
      <EmptyState
        icon="list"
        title="Your list is clear"
        description="Add your first task using the form above. Every task is saved in this browser automatically."
      />
    )
  }

  if (tasks.length === 0) {
    if (filter === 'active') {
      return (
        <EmptyState
          icon="check"
          title="Nothing left to do"
          description="Every task is completed. Enjoy the clear space, or switch to All to review your finished work."
        />
      )
    }

    return (
      <EmptyState
        icon="filter"
        title="No completed tasks yet"
        description="Tick a task off and it will appear here once it is done."
      />
    )
  }

  const activeTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  const renderTasks = (list: Task[]) =>
    list.map((task) => (
      <TaskItem
        key={task.id}
        task={task}
        onToggle={onToggle}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    ))

  return (
    <div className="task-sections">
      {activeTasks.length > 0 && (
        <section className="task-section" aria-labelledby="active-heading">
          <h3 className="task-section__heading" id="active-heading">
            <span className="task-section__indicator" data-priority="active" aria-hidden="true" />
            Active
            <span className="task-section__count">{activeTasks.length}</span>
          </h3>
          <ul className="task-list">{renderTasks(activeTasks)}</ul>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section className="task-section" aria-labelledby="completed-heading">
          <h3 className="task-section__heading" id="completed-heading">
            <span className="task-section__indicator" data-priority="completed" aria-hidden="true" />
            Completed
            <span className="task-section__count">{completedTasks.length}</span>
          </h3>
          <ul className="task-list">{renderTasks(completedTasks)}</ul>
        </section>
      )}
    </div>
  )
}
