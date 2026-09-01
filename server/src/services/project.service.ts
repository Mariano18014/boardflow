import type { Project } from "@prisma/client";
import type { CreateProjectInput, ProjectListItem } from "@shared/schemas/project.schema";
import { ConflictError, ForbiddenError, NotFoundError } from "../lib/errors";
import { findMembershipForUser } from "../db/repositories/membership.repository";
import { checkRequesterHasPermission } from "../modules/permissions/check-permission";
import {
  logProjectArchivedActivity,
  logProjectCreatedActivity,
  logProjectRestoredActivity,
} from "../modules/activity-log/activity-log.service";
import {
  createProject as saveProjectRecord,
  findProjectByKey,
  findProjectById as findProjectRecordById,
  findProjectByIdAndOrganizationId,
  findProjectsByOrganizationId,
  findProjectsForOrganization,
  updateProjectArchivedStatus as saveProjectArchivedStatus,
  type ProjectWithBoardsCount,
} from "../db/repositories/project.repository";

const MIN_PROJECT_KEY_LENGTH = 2;
const MAX_PROJECT_KEY_LENGTH = 5;

export async function createProject(input: CreateProjectInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "projects:create");
  const key = await generateUniqueProjectKey(input.name, input.organizationId);
  const project = await saveProjectInDatabase(input, key, requesterId);
  await logProjectCreated(project, requesterId);
  return project;
}

async function logProjectCreated(project: Project, actorId: string) {
  await logProjectCreatedActivity(project.organizationId, actorId, project.id, {
    name: project.name,
    key: project.key,
  });
}

async function validateUserIsMember(organizationId: string, userId: string) {
  const membership = await findMembershipForUser(organizationId, userId);
  if (!membership) {
    throw new ForbiddenError("No pertenecés a esta organización.");
  }
}

async function generateUniqueProjectKey(name: string, organizationId: string) {
  const baseKey = buildProjectKeyFromName(name);
  let candidateKey = baseKey;
  let suffix = 1;
  while (!(await checkProjectKeyAvailability(candidateKey, organizationId))) {
    suffix += 1;
    candidateKey = `${baseKey}${suffix}`;
  }
  return candidateKey;
}

function buildProjectKeyFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter((word) => word.length > 0);
  const initials = buildInitialsFromWords(words);
  return ensureMinimumKeyLength(initials, words);
}

function buildInitialsFromWords(words: string[]): string {
  const initials = words.map((word) => word.charAt(0)).join("").toUpperCase();
  return initials.slice(0, MAX_PROJECT_KEY_LENGTH);
}

function ensureMinimumKeyLength(initials: string, words: string[]): string {
  if (initials.length >= MIN_PROJECT_KEY_LENGTH) {
    return initials;
  }
  const firstWordLetters = (words[0] ?? "").toUpperCase();
  return firstWordLetters.slice(0, MIN_PROJECT_KEY_LENGTH).padEnd(MIN_PROJECT_KEY_LENGTH, "X");
}

async function checkProjectKeyAvailability(key: string, organizationId: string) {
  const existingProject = await findProjectByKey(organizationId, key);
  return existingProject === null;
}

async function saveProjectInDatabase(input: CreateProjectInput, key: string, creatorId: string) {
  return saveProjectRecord({
    name: input.name,
    key,
    organizationId: input.organizationId,
    createdBy: creatorId,
    description: input.description,
  });
}

export async function getProjectsForOrganization(organizationId: string, userId: string) {
  await validateUserIsMember(organizationId, userId);
  return findProjectsByOrganizationId(organizationId);
}

export async function getProjectById(projectId: string, userId: string) {
  const project = await findProjectRecordById(projectId);
  if (!project) {
    throw new NotFoundError("Proyecto no encontrado.");
  }
  await validateUserIsMember(project.organizationId, userId);
  return project;
}

export type GetProjectsInput = {
  organizationId: string;
  includeArchived: boolean;
  limit: number;
  offset: number;
};

export async function getOrganizationProjects(
  input: GetProjectsInput,
  requesterId: string,
): Promise<ProjectListItem[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "projects:view");
  const projects = await findProjectsByOrganization(input);
  return projects;
}

async function findProjectsByOrganization(input: GetProjectsInput): Promise<ProjectListItem[]> {
  const projects = await findProjectsForOrganization(input.organizationId, {
    includeArchived: input.includeArchived,
    limit: input.limit,
    offset: input.offset,
  });
  return attachBoardsCountToProjects(projects);
}

function attachBoardsCountToProjects(projects: ProjectWithBoardsCount[]): ProjectListItem[] {
  return projects.map(mapProjectWithBoardsCountToListItem);
}

function mapProjectWithBoardsCountToListItem(project: ProjectWithBoardsCount): ProjectListItem {
  return {
    id: project.id,
    name: project.name,
    key: project.key,
    description: project.description,
    isArchived: project.isArchived,
    createdAt: project.createdAt,
    boardsCount: project._count.boards,
  };
}

export type ArchiveProjectInput = {
  organizationId: string;
  projectId: string;
};

export type RestoreProjectInput = {
  organizationId: string;
  projectId: string;
};

export async function archiveProject(input: ArchiveProjectInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "projects:delete");
  const project = await findProjectById(input.projectId, input.organizationId);
  await checkProjectIsNotAlreadyArchived(project);
  const archivedProject = await updateProjectArchivedStatus(project, true);
  await logProjectArchived(archivedProject, requesterId);
  return archivedProject;
}

async function logProjectArchived(project: Project, actorId: string) {
  await logProjectArchivedActivity(project.organizationId, actorId, project.id, { name: project.name });
}

export async function restoreProject(input: RestoreProjectInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "projects:edit");
  const project = await findProjectById(input.projectId, input.organizationId);
  await checkProjectIsCurrentlyArchived(project);
  const restoredProject = await updateProjectArchivedStatus(project, false);
  await logProjectRestored(restoredProject, requesterId);
  return restoredProject;
}

async function logProjectRestored(project: Project, actorId: string) {
  await logProjectRestoredActivity(project.organizationId, actorId, project.id, { name: project.name });
}

// Shared by every module that needs to look up a project scoped to its
// organization (boards, tasks, ...) so the 404-if-missing check isn't
// duplicated across services.
export async function findProjectById(projectId: string, organizationId: string): Promise<Project> {
  const project = await findProjectByIdAndOrganizationId(projectId, organizationId);
  if (!project) {
    throw new NotFoundError("El proyecto no existe en esta organización.");
  }
  return project;
}

// Shared by every module that creates child records (boards, tasks, sprints,
// ...) under a project, since none of them make sense once the project is
// archived.
export async function checkProjectIsNotArchived(project: Project) {
  if (project.isArchived) {
    throw new ConflictError("No se pueden agregar elementos a un proyecto archivado.");
  }
}

async function checkProjectIsNotAlreadyArchived(project: Project) {
  if (project.isArchived) {
    throw new ConflictError("El proyecto ya está archivado.");
  }
}

async function checkProjectIsCurrentlyArchived(project: Project) {
  if (!project.isArchived) {
    throw new ConflictError("El proyecto no está archivado.");
  }
}

async function updateProjectArchivedStatus(project: Project, isArchived: boolean) {
  return saveProjectArchivedStatus(project.id, isArchived);
}
