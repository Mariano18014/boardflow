import type { BurndownPoint } from "./fetch-sprint-burndown.api";

export type BurndownChartPoint = {
  date: string;
  ideal: number;
  actual: number | undefined;
};

export function mergeBurndownLines(idealLine: BurndownPoint[], actualLine: BurndownPoint[]): BurndownChartPoint[] {
  const actualPointsByDate = new Map(actualLine.map((point) => [point.date, point.remainingPoints]));
  return idealLine.map((point) => ({
    date: point.date,
    ideal: point.remainingPoints,
    actual: actualPointsByDate.get(point.date),
  }));
}
