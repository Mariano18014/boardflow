import type { CreateProjectInput, ProjectListItem } from "@shared/schemas/project.schema";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import { findMembershipForUser } from "../db/repositories/membership.repository";
import { checkRequesterHasPermission } from "../modules/permissions/check-permission";
import {
  createProject as saveProjectRecord,
  findProjectByKey,
  findProjectById as findProjectRecordById,
  findProjectsByOrganizationId,
  findProjectsForOrganization,
  type ProjectWithBoardsCount,
} from "../db/repositories/project.repository";

const MIN_PROJECT_KEY_LENGTH = 2;
const MAX_PROJECT_KEY_LENGTH = 5;

export async function createProject(input: CreateProjectInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "projects:create");
  const key = await generateUniqueProjectKey(input.name, input.organizationId);
  const project = await saveProjectInDatabase(input, key, requesterId);
  return project;
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
