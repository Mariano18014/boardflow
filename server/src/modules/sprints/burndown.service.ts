import type { ActivityLog, Sprint } from "@prisma/client";
import { findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { findActivityLogsByEntityIds } from "../activity-log/activity-log.repository";
import {
  TASK_COMPLETED_ACTION,
  TASK_ENTITY_TYPE,
  TASK_REOPENED_ACTION,
} from "../activity-log/activity-log.constants";
import { findTasksBySprintId, sumEstimatedPointsForSprint } from "../tasks/tasks.repository";
import { checkSprintIsActive, findSprintById } from "./sprints.service";

export type GetSprintBurndownInput = {
  organizationId: string;
  projectId: string;
  sprintId: string;
};

export type BurndownPoint = {
  date: string;
  remainingPoints: number;
};

export type SprintBurndown = {
  sprint: {
    name: string;
    startDate: Date;
    endDate: Date;
  };
  totalCommittedPoints: number;
  idealLine: BurndownPoint[];
  actualLine: BurndownPoint[];
};

export async function getSprintBurndown(
  input: GetSprintBurndownInput,
  requesterId: string,
): Promise<SprintBurndown> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "sprints:view");
  // findSprintById only confirms the sprint belongs to projectId — it says
  // nothing about projectId belonging to organizationId, so this extra check
  // (same as every other module in this codebase) is what actually prevents
  // cross-organization access.
  await findProjectById(input.projectId, input.organizationId);
  const sprint = await findSprintById(input.sprintId, input.projectId);
  checkSprintIsActive(sprint);
  const totalCommittedPoints = await calculateTotalCommittedPoints(sprint.id);
  const idealLine = buildIdealBurndownLine(sprint, totalCommittedPoints);
  const actualLine = await buildActualBurndownLine(sprint, totalCommittedPoints);
  return {
    sprint: { name: sprint.name, startDate: sprint.startDate, endDate: sprint.endDate },
    totalCommittedPoints,
    idealLine,
    actualLine,
  };
}

async function calculateTotalCommittedPoints(sprintId: string): Promise<number> {
  return sumEstimatedPointsForSprint(sprintId);
}

// One point per calendar day of the sprint's full planned range, decreasing
// linearly from totalPoints (startDate) to 0 (endDate) — a straight line,
// unaffected by anything that actually happened during the sprint.
function buildIdealBurndownLine(sprint: Sprint, totalPoints: number): BurndownPoint[] {
  const calendarDays = buildCalendarDayRange(sprint.startDate, sprint.endDate);
  const totalIntervals = calendarDays.length - 1;
  return calendarDays.map((day, dayIndex) => ({
    date: formatDateAsIsoDay(day),
    remainingPoints: calculateIdealRemainingPoints(totalPoints, totalIntervals, dayIndex),
  }));
}

function calculateIdealRemainingPoints(totalPoints: number, totalIntervals: number, dayIndex: number): number {
  if (totalIntervals === 0) {
    return totalPoints;
  }
  const pointsBurnedPerDay = totalPoints / totalIntervals;
  return roundBurndownPoints(totalPoints - pointsBurnedPerDay * dayIndex);
}

// One point per calendar day from startDate up to today (or endDate if the
// sprint is already over, whichever comes first) — what actually happened,
// based on task.completed/task.reopened events recorded in HU-35's part A.
async function buildActualBurndownLine(sprint: Sprint, totalPoints: number): Promise<BurndownPoint[]> {
  const calendarDays = buildCalendarDayRange(sprint.startDate, calculateActualLineEndDate(sprint.endDate));
  const completionEvents = await findCompletionEventsForSprint(sprint.id);
  const netPointsByDay = calculateNetCompletedPointsByDay(completionEvents, calendarDays);
  return buildRemainingPointsLine(calendarDays, totalPoints, netPointsByDay);
}

function calculateActualLineEndDate(sprintEndDate: Date): Date {
  const today = new Date();
  return today < sprintEndDate ? today : sprintEndDate;
}

type CompletionEvent = {
  createdAt: Date;
  netPoints: number;
};

async function findCompletionEventsForSprint(sprintId: string): Promise<CompletionEvent[]> {
  const sprintTasks = await findTasksBySprintId(sprintId);
  const taskIds = sprintTasks.map((task) => task.id);
  if (taskIds.length === 0) {
    return [];
  }
  const activityLogs = await findActivityLogsByEntityIds(TASK_ENTITY_TYPE, taskIds, [
    TASK_COMPLETED_ACTION,
    TASK_REOPENED_ACTION,
  ]);
  return activityLogs.map(mapActivityLogToCompletionEvent);
}

function mapActivityLogToCompletionEvent(activityLog: ActivityLog): CompletionEvent {
  const points = extractPointsFromMetadata(activityLog.metadata);
  const netPoints = activityLog.action === TASK_COMPLETED_ACTION ? points : -points;
  return { createdAt: activityLog.createdAt, netPoints };
}

function extractPointsFromMetadata(metadata: unknown): number {
  if (metadata === null || typeof metadata !== "object") {
    return 0;
  }
  const points = (metadata as { points?: unknown }).points;
  return typeof points === "number" ? points : 0;
}

// Processes completed/reopened events in chronological order (the repository
// already returns them sorted by createdAt), netting out same-day
// completions and reopenings into a single per-day delta.
function calculateNetCompletedPointsByDay(
  completionEvents: CompletionEvent[],
  calendarDays: Date[],
): Map<string, number> {
  const netPointsByDay = new Map<string, number>();
  for (const day of calendarDays) {
    netPointsByDay.set(formatDateAsIsoDay(day), 0);
  }
  for (const event of completionEvents) {
    const eventDay = formatDateAsIsoDay(event.createdAt);
    const currentNetPoints = netPointsByDay.get(eventDay);
    if (currentNetPoints !== undefined) {
      netPointsByDay.set(eventDay, currentNetPoints + event.netPoints);
    }
  }
  return netPointsByDay;
}

function buildRemainingPointsLine(
  calendarDays: Date[],
  totalPoints: number,
  netPointsByDay: Map<string, number>,
): BurndownPoint[] {
  let cumulativeNetPoints = 0;
  return calendarDays.map((day) => {
    const isoDay = formatDateAsIsoDay(day);
    cumulativeNetPoints += netPointsByDay.get(isoDay) ?? 0;
    return { date: isoDay, remainingPoints: totalPoints - cumulativeNetPoints };
  });
}

function buildCalendarDayRange(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const cursor = truncateToCalendarDay(startDate);
  const lastDay = truncateToCalendarDay(endDate);
  while (cursor.getTime() <= lastDay.getTime()) {
    days.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

function truncateToCalendarDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function formatDateAsIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function roundBurndownPoints(points: number): number {
  return Math.round(points * 100) / 100;
}
