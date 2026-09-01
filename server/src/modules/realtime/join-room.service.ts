import { NotFoundError } from "../../lib/errors";
import { getProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { findSprintByIdOnly } from "../sprints/sprints.repository";

const VIEW_TASKS_PERMISSION = "tasks:view";

export async function checkRequesterCanJoinBacklogRoom(projectId: string, requesterId: string): Promise<void> {
  const project = await getProjectById(projectId, requesterId);
  await checkRequesterHasPermission(project.organizationId, requesterId, VIEW_TASKS_PERMISSION);
}

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
