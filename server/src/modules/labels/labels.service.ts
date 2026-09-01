import type { Label } from "@prisma/client";
import type { CreateLabelInput } from "@shared/schemas/label.schema";
import { ConflictError, ValidationError } from "../../lib/errors";
import { checkProjectIsNotArchived, findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import {
  createLabel as saveLabelRecord,
  findLabelByProjectIdAndName,
  findLabelsByProjectId,
} from "./labels.repository";

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export async function createLabel(input: CreateLabelInput, requesterId: string): Promise<Label> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "labels:create");
  const project = await findProjectById(input.projectId, input.organizationId);
  await checkProjectIsNotArchived(project);
  await checkLabelNameIsUnique(input.projectId, input.name);
  await checkColorFormatIsValid(input.color);
  const label = await saveLabelInDatabase(input);
  return label;
}

async function checkLabelNameIsUnique(projectId: string, name: string) {
  const existingLabel = await findLabelByProjectIdAndName(projectId, name);
  if (existingLabel) {
    throw new ConflictError(`Ya existe un label llamado "${name}" en este proyecto.`);
  }
}

async function checkColorFormatIsValid(color: string) {
  if (!HEX_COLOR_PATTERN.test(color)) {
    throw new ValidationError({
      color: ['El color debe tener el formato hexadecimal de 6 dígitos (ej. "#4F46E5").'],
    });
  }
}

async function saveLabelInDatabase(input: CreateLabelInput): Promise<Label> {
  return saveLabelRecord({
    projectId: input.projectId,
    name: input.name,
    color: input.color,
  });
}

export type GetProjectLabelsInput = {
  organizationId: string;
  projectId: string;
};

export async function getProjectLabels(input: GetProjectLabelsInput, requesterId: string): Promise<Label[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "labels:view");
  await findProjectById(input.projectId, input.organizationId);
  return findLabelsForProject(input.projectId);
}

async function findLabelsForProject(projectId: string): Promise<Label[]> {
  return findLabelsByProjectId(projectId);
}
