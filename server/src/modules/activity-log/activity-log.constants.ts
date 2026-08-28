// Shared action/entity type identifiers, so tasks (which logs these events)
// and sprints (which reads them back for the burndown chart) agree on the
// exact strings without either module hardcoding the other's literals.
export const TASK_ENTITY_TYPE = "task";
export const TASK_COMPLETED_ACTION = "task.completed";
export const TASK_REOPENED_ACTION = "task.reopened";
