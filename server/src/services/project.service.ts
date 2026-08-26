import type { CreateProjectInput } from "@shared/schemas/project.schema";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import { findMembershipForUser } from "../db/repositories/membership.repository";
import {
  createProject as saveProjectRecord,
  findProjectByKey,
  findProjectById as findProjectRecordById,
  findProjectsByOrganizationId,
} from "../db/repositories/project.repository";

export async function createProject(input: CreateProjectInput, creatorId: string) {
  await validateUserIsMember(input.organizationId, creatorId);
  const key = await generateUniqueProjectKey(input.name, input.organizationId);
  const project = await saveProjectInDatabase(input.name, key, input.organizationId, creatorId);
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
  const firstWord = name.trim().split(/\s+/)[0] ?? "";
  const letters = firstWord.replace(/[^a-zA-Z]/g, "");
  return (letters.slice(0, 3) || "PRJ").toUpperCase();
}

async function checkProjectKeyAvailability(key: string, organizationId: string) {
  const existingProject = await findProjectByKey(organizationId, key);
  return existingProject === null;
}

async function saveProjectInDatabase(
  name: string,
  key: string,
  organizationId: string,
  creatorId: string,
) {
  return saveProjectRecord({ name, key, organizationId, createdBy: creatorId });
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
