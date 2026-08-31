// HU-19 only ever created a placeholder board view (/boards/:boardId,
// BoardPage.tsx) with the intention that Epic 4 would replace it. That real
// content shipped in HU-28, but as the sprint board (scoped by sprintId, not
// boardId) — a board's actual content only exists for whichever sprint is
// currently ACTIVE in its project. This resolves where a click on a board
// should really go: the active sprint's board, or nowhere (undefined) when
// the project has no active sprint to show.
export function resolveBoardNavigationTarget(
  projectId: string,
  activeSprintId: string | undefined,
): string | undefined {
  if (activeSprintId === undefined) {
    return undefined;
  }
  return `/projects/${projectId}/sprints/${activeSprintId}/board`;
}
