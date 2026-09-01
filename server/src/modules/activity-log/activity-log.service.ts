import type { ActivityLog, Prisma, User } from "@prisma/client";
import type { ActivityLogActor, ActivityLogEntryWithSummary } from "@shared/schemas/activity-log.schema";
import type { SprintClosureSnapshot } from "../sprints/sprint-closure-snapshot.types";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { createActivityLog, findActivityLogEntriesByOrganizationId } from "./activity-log.repository";
import {
  INVITATION_ENTITY_TYPE,
  MEMBER_INVITED_ACTION,
  MEMBER_REMOVED_ACTION,
  MEMBER_ROLE_CHANGED_ACTION,
  MEMBERSHIP_ENTITY_TYPE,
  ORGANIZATION_ENTITY_TYPE,
  ORGANIZATION_UPDATED_ACTION,
  PROJECT_ARCHIVED_ACTION,
  PROJECT_CREATED_ACTION,
  PROJECT_ENTITY_TYPE,
  PROJECT_RESTORED_ACTION,
  SPRINT_CLOSED_ACTION,
  TASK_COMPLETED_ACTION,
  TASK_REOPENED_ACTION,
} from "./activity-log.constants";

export async function createActivityLogEntry(
  organizationId: string,
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Prisma.InputJsonValue,
): Promise<void> {
  await createActivityLog({ organizationId, actorId, action, entityType, entityId, metadata });
}

export async function logMemberInvitedActivity(
  organizationId: string,
  actorId: string,
  invitationId: string,
  metadata: { email: string; roleId: string; roleName: string },
): Promise<void> {
  await createActivityLogEntry(
    organizationId,
    actorId,
    MEMBER_INVITED_ACTION,
    INVITATION_ENTITY_TYPE,
    invitationId,
    metadata,
  );
}

export async function logMemberRoleChangedActivity(
  organizationId: string,
  actorId: string,
  membershipId: string,
  metadata: { targetUserId: string; targetUserName: string; previousRoleName: string; newRoleName: string },
): Promise<void> {
  await createActivityLogEntry(
    organizationId,
    actorId,
    MEMBER_ROLE_CHANGED_ACTION,
    MEMBERSHIP_ENTITY_TYPE,
    membershipId,
    metadata,
  );
}

export async function logMemberRemovedActivity(
  organizationId: string,
  actorId: string,
  membershipId: string,
  metadata: { targetUserId: string; targetUserEmail: string },
): Promise<void> {
  await createActivityLogEntry(
    organizationId,
    actorId,
    MEMBER_REMOVED_ACTION,
    MEMBERSHIP_ENTITY_TYPE,
    membershipId,
    metadata,
  );
}

export async function logOrganizationUpdatedActivity(
  organizationId: string,
  actorId: string,
  metadata: { changedFields: string[] },
): Promise<void> {
  if (metadata.changedFields.length === 0) {
    return;
  }
  await createActivityLogEntry(
    organizationId,
    actorId,
    ORGANIZATION_UPDATED_ACTION,
    ORGANIZATION_ENTITY_TYPE,
    organizationId,
    metadata,
  );
}

export async function logProjectCreatedActivity(
  organizationId: string,
  actorId: string,
  projectId: string,
  metadata: { name: string; key: string },
): Promise<void> {
  await createActivityLogEntry(
    organizationId,
    actorId,
    PROJECT_CREATED_ACTION,
    PROJECT_ENTITY_TYPE,
    projectId,
    metadata,
  );
}

export async function logProjectArchivedActivity(
  organizationId: string,
  actorId: string,
  projectId: string,
  metadata: { name: string },
): Promise<void> {
  await createActivityLogEntry(
    organizationId,
    actorId,
    PROJECT_ARCHIVED_ACTION,
    PROJECT_ENTITY_TYPE,
    projectId,
    metadata,
  );
}

export async function logProjectRestoredActivity(
  organizationId: string,
  actorId: string,
  projectId: string,
  metadata: { name: string },
): Promise<void> {
  await createActivityLogEntry(
    organizationId,
    actorId,
    PROJECT_RESTORED_ACTION,
    PROJECT_ENTITY_TYPE,
    projectId,
    metadata,
  );
}

type Pagination = {
  limit: number;
  offset: number;
};

export type GetActivityLogInput = {
  organizationId: string;
  pagination: Pagination;
};

type ActivityLogEntryWithActor = ActivityLog & { actor: User };

export async function getOrganizationActivityLog(
  input: GetActivityLogInput,
  requesterId: string,
): Promise<ActivityLogEntryWithSummary[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "activity:view");
  const logEntries = await findActivityLogEntries(input.organizationId, input.pagination);
  const entriesWithSummary = await buildActivityLogSummaries(logEntries);
  return entriesWithSummary;
}

async function findActivityLogEntries(
  organizationId: string,
  pagination: Pagination,
): Promise<ActivityLogEntryWithActor[]> {
  return findActivityLogEntriesByOrganizationId(organizationId, pagination);
}

async function buildActivityLogSummaries(
  entries: ActivityLogEntryWithActor[],
): Promise<ActivityLogEntryWithSummary[]> {
  return entries.map(buildSummaryForEntry);
}

function buildSummaryForEntry(entry: ActivityLogEntryWithActor): ActivityLogEntryWithSummary {
  return {
    id: entry.id,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    createdAt: entry.createdAt,
    summary: buildSummaryText(entry.action, entry.metadata as Record<string, unknown>),
    actor: mapUserToActivityLogActor(entry.actor),
  };
}

function buildSummaryText(action: string, metadata: Record<string, unknown>): string {
  switch (action) {
    case MEMBER_INVITED_ACTION:
      return `Invitó a ${metadata.email} como ${metadata.roleName}.`;
    case MEMBER_ROLE_CHANGED_ACTION:
      return `Cambió el rol de ${metadata.targetUserName} de ${metadata.previousRoleName} a ${metadata.newRoleName}.`;
    case MEMBER_REMOVED_ACTION:
      return `Removió a ${metadata.targetUserEmail} de la organización.`;
    case ORGANIZATION_UPDATED_ACTION:
      return `Actualizó la organización (${buildChangedFieldsText(metadata.changedFields as string[])}).`;
    case PROJECT_CREATED_ACTION:
      return `Creó el proyecto ${metadata.name} (${metadata.key}).`;
    case PROJECT_ARCHIVED_ACTION:
      return `Archivó el proyecto ${metadata.name}.`;
    case PROJECT_RESTORED_ACTION:
      return `Restauró el proyecto ${metadata.name}.`;
    case TASK_COMPLETED_ACTION:
      return `Completó una tarea de ${metadata.points} puntos.`;
    case TASK_REOPENED_ACTION:
      return `Reabrió una tarea de ${metadata.points} puntos.`;
    case SPRINT_CLOSED_ACTION:
      return buildSprintClosedSummary(metadata as unknown as SprintClosureSnapshot);
    default:
      return `Realizó una acción: ${action}.`;
  }
}

const CHANGED_FIELD_LABELS: Record<string, string> = {
  name: "nombre",
  logo: "logo",
};

function buildChangedFieldsText(changedFields: string[]): string {
  return changedFields.map((field) => CHANGED_FIELD_LABELS[field] ?? field).join(", ");
}

function buildSprintClosedSummary(snapshot: SprintClosureSnapshot): string {
  return `Cerró el sprint "${snapshot.sprintName}" (${snapshot.completedPoints}/${snapshot.totalCommittedPoints} puntos completados).`;
}

function mapUserToActivityLogActor(user: User): ActivityLogActor {
  return {
    id: user.id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
  };
}
