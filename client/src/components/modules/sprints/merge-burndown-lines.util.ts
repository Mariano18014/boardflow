import type { BurndownPoint } from "./fetch-sprint-burndown.api";

export type BurndownChartPoint = {
  date: string;
  ideal: number;
  actual: number | undefined;
};

// The actual line stops at today (see buildActualBurndownLine on the
// backend) while the ideal line always spans the full sprint, so dates past
// today simply get no `actual` value here — recharts skips those points
// instead of drawing a line down to zero.
export function mergeBurndownLines(idealLine: BurndownPoint[], actualLine: BurndownPoint[]): BurndownChartPoint[] {
  const actualPointsByDate = new Map(actualLine.map((point) => [point.date, point.remainingPoints]));
  return idealLine.map((point) => ({
    date: point.date,
    ideal: point.remainingPoints,
    actual: actualPointsByDate.get(point.date),
  }));
}
