import type { Task, TaskAssignee, User } from "@prisma/client";
import type { AssigneeSummary } from "@shared/schemas/task-assignee.schema";
import { ValidationError } from "../../../lib/errors";
import { findProjectById } from "../../../services/project.service";
import { checkRequesterHasPermission } from "../../permissions/check-permission";
import { findActiveMembershipsByUserIds } from "../../../db/repositories/membership.repository";
import { findUserById } from "../../../db/repositories/user.repository";
import { createTaskAssignedNotification } from "../../notifications/notifications.service";
import { notifyTaskContextChanged } from "../../realtime/notify.service";
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
  const previousAssignees = await findAssigneesByTaskId(task.id);
  await checkAllUserIdsAreActiveMembers(input.userIds, input.organizationId);
  const updatedAssignees = await replaceAssigneeRecordsForTask(task.id, input.userIds);
  await notifyNewlyAssignedUsers(
    previousAssignees.map((assignee) => assignee.id),
    input.userIds,
    task,
    input.organizationId,
    requesterId,
  );
  await notifyTaskContextChanged(task);
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

// Notifies only the users who are actually new to this task (present in the
// new set but not the previous one) — never someone already assigned, never
// someone who got unassigned, and never the requester if they assigned
// themselves.
async function notifyNewlyAssignedUsers(
  previousAssigneeIds: string[],
  newAssigneeIds: string[],
  task: Task,
  organizationId: string,
  actorId: string,
): Promise<void> {
  const newlyAddedUserIds = findNewlyAddedAssigneeIds(previousAssigneeIds, newAssigneeIds, actorId);
  if (newlyAddedUserIds.length === 0) {
    return;
  }
  const actor = await findUserById(actorId);
  for (const userId of newlyAddedUserIds) {
    await createTaskAssignedNotification(userId, {
      taskId: task.id,
      taskTitle: task.title,
      projectId: task.projectId,
      organizationId,
      assignedByUserId: actorId,
      assignedByName: actor?.fullName ?? "",
    });
  }
}

function findNewlyAddedAssigneeIds(
  previousAssigneeIds: string[],
  newAssigneeIds: string[],
  actorId: string,
): string[] {
  const previousIds = new Set(previousAssigneeIds);
  return newAssigneeIds.filter((userId) => !previousIds.has(userId) && userId !== actorId);
}

function mapAssigneeRecordToSummary(record: AssigneeRecordWithUser): AssigneeSummary {
  return {
    id: record.user.id,
    fullName: record.user.fullName,
    avatarUrl: record.user.avatarUrl,
  };
}
