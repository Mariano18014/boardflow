import type { TaskAssignee, User } from "@prisma/client";
import type { AssigneeSummary } from "@shared/schemas/task-assignee.schema";
import { ValidationError } from "../../../lib/errors";
import { findProjectById } from "../../../services/project.service";
import { checkRequesterHasPermission } from "../../permissions/check-permission";
import { findActiveMembershipsByUserIds } from "../../../db/repositories/membership.repository";
import { findTaskById } from "../task.service";
import {
  findAssigneeRecordsByTaskId,
  replaceAssigneeRecordsForTask as saveReplacedAssigneeRecords,
} from "./assignees.repository";

type AssigneeRecordWithUser = TaskAssignee & { user: User };

export type ReplaceTaskAssigneesInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  userIds: string[];
};

export async function replaceTaskAssignees(
  input: ReplaceTaskAssigneesInput,
  requesterId: string,
): Promise<AssigneeSummary[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:edit");
  await findProjectById(input.projectId, input.organizationId);
  const task = await findTaskById(input.taskId, input.projectId);
  await checkAllUserIdsAreActiveMembers(input.userIds, input.organizationId);
  const updatedAssignees = await replaceAssigneeRecordsForTask(task.id, input.userIds);
  return updatedAssignees;
}

async function checkAllUserIdsAreActiveMembers(userIds: string[], organizationId: string) {
  if (userIds.length === 0) {
    return;
  }
  const activeMemberships = await findActiveMembershipsByUserIds(organizationId, userIds);
  const activeUserIds = new Set(activeMemberships.map((membership) => membership.userId));
  const invalidUserIds = userIds.filter((userId) => !activeUserIds.has(userId));
  if (invalidUserIds.length > 0) {
    throw new ValidationError({
      userIds: [
        `Los siguientes usuarios no son miembros activos de esta organización: ${invalidUserIds.join(", ")}`,
      ],
    });
  }
}

async function replaceAssigneeRecordsForTask(taskId: string, userIds: string[]): Promise<AssigneeSummary[]> {
  // Deduplicated before hitting the database: taskId+userId is a unique
  // constraint, so a repeated id in the payload would otherwise crash the
  // createMany call instead of just being a harmless no-op.
  const uniqueUserIds = Array.from(new Set(userIds));
  const records = await saveReplacedAssigneeRecords(taskId, uniqueUserIds);
  return records.map(mapAssigneeRecordToSummary);
}

// Shared by the backlog, sprint-board and task-detail services so none of
// them duplicate "go fetch a task's assignees".
export async function findAssigneesByTaskId(taskId: string): Promise<AssigneeSummary[]> {
  const records = await findAssigneeRecordsByTaskId(taskId);
  return records.map(mapAssigneeRecordToSummary);
}

function mapAssigneeRecordToSummary(record: AssigneeRecordWithUser): AssigneeSummary {
  return {
    id: record.user.id,
    fullName: record.user.fullName,
    avatarUrl: record.user.avatarUrl,
  };
}
