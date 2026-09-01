import type { SprintHistoryTask } from "./get-sprint-history.api";

export type SnapshotColumnGroup = {
  columnId: string | null;
  columnName: string;
  tasks: SprintHistoryTask[];
};

const NO_COLUMN_LABEL = "Sin columna";

export function groupSnapshotTasksByColumn(tasks: SprintHistoryTask[]): SnapshotColumnGroup[] {
  const groups: SnapshotColumnGroup[] = [];
  for (const task of tasks) {
    const group = findOrCreateGroup(groups, task);
    group.tasks.push(task);
  }
  return groups;
}

function findOrCreateGroup(groups: SnapshotColumnGroup[], task: SprintHistoryTask): SnapshotColumnGroup {
  const existingGroup = groups.find((group) => group.columnId === task.columnId);
  if (existingGroup) {
    return existingGroup;
  }
  const newGroup: SnapshotColumnGroup = {
    columnId: task.columnId,
    columnName: task.columnName ?? NO_COLUMN_LABEL,
    tasks: [],
  };
  groups.push(newGroup);
  return newGroup;
}
