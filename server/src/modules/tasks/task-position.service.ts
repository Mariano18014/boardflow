import { calculateNextPosition } from "../../lib/next-position.util";
import { findMaxBacklogPositionByProjectId, findMaxPositionInSprint } from "./tasks.repository";

// Shared "where does the next task go" calculation for whichever scope a task
// is entering — the project's backlog (sprintId null) or a specific sprint.
// Extracted out of Sprint Planning (HU-26) so sprint close (HU-32) can reuse
// it too, without either module owning a private copy.
export async function calculateNextPositionInScope(projectId: string, sprintId: string | null): Promise<number> {
  if (sprintId === null) {
    return calculateNextPosition(() => findMaxBacklogPositionByProjectId(projectId));
  }
  return calculateNextPosition(() => findMaxPositionInSprint(sprintId));
}
