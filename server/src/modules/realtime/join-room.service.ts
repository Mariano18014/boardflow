import { NotFoundError } from "../../lib/errors";
import { getProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { findSprintByIdOnly } from "../sprints/sprints.repository";

const VIEW_TASKS_PERMISSION = "tasks:view";

// Throws (ForbiddenError, NotFoundError) if the requester can't join the
// backlog:{projectId} room — the socket handler catches that and simply never
// joins the socket to the room, which is what keeps events scoped per
// project.
export async function checkRequesterCanJoinBacklogRoom(projectId: string, requesterId: string): Promise<void> {
  const project = await getProjectById(projectId, requesterId);
  await checkRequesterHasPermission(project.organizationId, requesterId, VIEW_TASKS_PERMISSION);
}

// Same idea as checkRequesterCanJoinBacklogRoom, but for sprint-board:{sprintId}
// rooms — it has to resolve the sprint's project first since the socket only
// sends a sprintId.
export async function checkRequesterCanJoinSprintBoardRoom(
  sprintId: string,
  requesterId: string,
): Promise<void> {
  const sprint = await findSprintByIdOnly(sprintId);
  if (sprint === null) {
    throw new NotFoundError("El sprint no existe.");
  }
  const project = await getProjectById(sprint.projectId, requesterId);
  await checkRequesterHasPermission(project.organizationId, requesterId, VIEW_TASKS_PERMISSION);
}
