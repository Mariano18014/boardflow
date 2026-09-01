const FIRST_POSITION = 0;

export async function calculateNextPosition(
  findMaxPosition: () => Promise<number | null>,
): Promise<number> {
  const maxPosition = await findMaxPosition();
  if (maxPosition === null) {
    return FIRST_POSITION;
  }
  return maxPosition + 1;
}
