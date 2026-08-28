export function describeColumnTaskCount(taskCount: number, wipLimit: number | null): string {
  if (wipLimit === null) {
    return String(taskCount);
  }
  return `${taskCount} / ${wipLimit}`;
}
