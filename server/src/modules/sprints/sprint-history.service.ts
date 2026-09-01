import { ConflictError } from "../../lib/errors";
import { findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { findActivityLogByEntityId } from "../activity-log/activity-log.repository";
import { SPRINT_CLOSED_ACTION, SPRINT_ENTITY_TYPE } from "../activity-log/activity-log.constants";
import type { SprintClosureSnapshot } from "./sprint-closure-snapshot.types";
import { findSprintById } from "./sprints.service";
import type { Sprint } from "@prisma/client";

export type GetSprintHistoryInput = {
  organizationId: string;
  projectId: string;
  sprintId: string;
};

export type SprintHistoryResult =
  | { available: true; snapshot: SprintClosureSnapshot }
  | { available: false };

export async function getSprintHistory(
  input: GetSprintHistoryInput,
  requesterId: string,
): Promise<SprintHistoryResult> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "sprints:view");

  await findProjectById(input.projectId, input.organizationId);
  const sprint = await findSprintById(input.sprintId, input.projectId);
  checkSprintIsCompleted(sprint);
  const closureLog = await findSprintClosureLog(sprint.id);
  if (!closureLog) {
    return { available: false };
  }
  return { available: true, snapshot: closureLog.metadata as unknown as SprintClosureSnapshot };
}

function checkSprintIsCompleted(sprint: Sprint) {
  if (sprint.status !== "COMPLETED") {
    throw new ConflictError(
      `El historial solo está disponible para sprints cerrados (estado actual: ${sprint.status}).`,
    );
  }
}

async function findSprintClosureLog(sprintId: string) {
  return findActivityLogByEntityId(SPRINT_ENTITY_TYPE, sprintId, SPRINT_CLOSED_ACTION);
}
