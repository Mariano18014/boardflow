const FIRST_POSITION = 0;

// Shared "append to the end of a list" pattern: give it a function that finds
// the current max position for whatever scope you care about (a project's
// boards, a project's backlog tasks, ...) and it returns where the next item
// should go.
export async function calculateNextPosition(
  findMaxPosition: () => Promise<number | null>,
): Promise<number> {
  const maxPosition = await findMaxPosition();
  if (maxPosition === null) {
    return FIRST_POSITION;
  }
  return maxPosition + 1;
}
