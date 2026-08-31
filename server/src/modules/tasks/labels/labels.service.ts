import type { Label, TaskLabel } from "@prisma/client";
import type { LabelSummary } from "@shared/schemas/task-label.schema";
import { ValidationError } from "../../../lib/errors";
import { findProjectById } from "../../../services/project.service";
import { checkRequesterHasPermission } from "../../permissions/check-permission";
import { findLabelsByIdsAndProjectId } from "../../labels/labels.repository";
import { findTaskById } from "../task.service";
import {
  findLabelRecordsByTaskId,
  replaceLabelRecordsForTask as saveReplacedLabelRecords,
} from "./labels.repository";

type LabelRecordWithLabel = TaskLabel & { label: Label };

export type ReplaceTaskLabelsInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  labelIds: string[];
};

export async function replaceTaskLabels(
  input: ReplaceTaskLabelsInput,
  requesterId: string,
): Promise<LabelSummary[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:edit");
  // findTaskById only confirms the task belongs to projectId — it says
  // nothing about projectId belonging to organizationId, so this extra check
  // (same as every other module in this codebase, see assignees.service.ts)
  // is what actually prevents cross-organization access.
  await findProjectById(input.projectId, input.organizationId);
  const task = await findTaskById(input.taskId, input.projectId);
  await checkAllLabelIdsBelongToProject(input.labelIds, input.projectId);
  const updatedLabels = await replaceLabelRecordsForTask(task.id, input.labelIds);
  return updatedLabels;
}

async function checkAllLabelIdsBelongToProject(labelIds: string[], projectId: string) {
  if (labelIds.length === 0) {
    return;
  }
  const projectLabels = await findLabelsByIdsAndProjectId(labelIds, projectId);
  const projectLabelIds = new Set(projectLabels.map((label) => label.id));
  const invalidLabelIds = labelIds.filter((labelId) => !projectLabelIds.has(labelId));
  if (invalidLabelIds.length > 0) {
    throw new ValidationError({
      labelIds: [`Los siguientes labels no pertenecen a este proyecto: ${invalidLabelIds.join(", ")}`],
    });
  }
}

async function replaceLabelRecordsForTask(taskId: string, labelIds: string[]): Promise<LabelSummary[]> {
  // Deduplicated before hitting the database: taskId+labelId is a unique
  // constraint, so a repeated id in the payload would otherwise crash the
  // createMany call instead of just being a harmless no-op.
  const uniqueLabelIds = Array.from(new Set(labelIds));
  const records = await saveReplacedLabelRecords(taskId, uniqueLabelIds);
  return records.map(mapLabelRecordToSummary);
}

// Shared by the backlog, sprint-board and task-detail services so none of
// them duplicate "go fetch a task's labels".
export async function findLabelsByTaskId(taskId: string): Promise<LabelSummary[]> {
  const records = await findLabelRecordsByTaskId(taskId);
  return records.map(mapLabelRecordToSummary);
}

function mapLabelRecordToSummary(record: LabelRecordWithLabel): LabelSummary {
  return {
    id: record.label.id,
    name: record.label.name,
    color: record.label.color,
  };
}
