

export function resolveBoardNavigationTarget(
  projectId: string,
  activeSprintId: string | undefined,
): string | undefined {
  if (activeSprintId === undefined) {
    return undefined;
  }
  return `/projects/${projectId}/sprints/${activeSprintId}/board`;
}
