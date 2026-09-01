import { calculateNextPosition } from "../../lib/next-position.util";
import { findMaxBacklogPositionByProjectId, findMaxPositionInSprint } from "./tasks.repository";

export async function calculateNextPositionInScope(projectId: string, sprintId: string | null): Promise<number> {
  if (sprintId === null) {
    return calculateNextPosition(() => findMaxBacklogPositionByProjectId(projectId));
  }
  return calculateNextPosition(() => findMaxPositionInSprint(sprintId));
}
