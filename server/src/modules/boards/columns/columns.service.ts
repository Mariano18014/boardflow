import { createColumn, findColumnsByBoardId } from "./columns.repository";

// The fixed set of status columns every board gets seeded with the first time
// its board is opened (HU-28). Not user-configurable in this HU.
const DEFAULT_COLUMN_NAMES = ["To Do", "In Progress", "Review", "Done"];

// Idempotent: only seeds the default columns the first time a board has none.
export async function ensureDefaultColumnsExist(boardId: string) {
  const boardHasColumns = await checkBoardHasColumns(boardId);
  if (boardHasColumns) {
    return;
  }
  await createDefaultColumns(boardId);
}

async function checkBoardHasColumns(boardId: string): Promise<boolean> {
  const existingColumns = await findColumnsByBoardId(boardId);
  return existingColumns.length > 0;
}

async function createDefaultColumns(boardId: string) {
  for (let position = 0; position < DEFAULT_COLUMN_NAMES.length; position++) {
    await createColumn({ boardId, name: DEFAULT_COLUMN_NAMES[position], position });
  }
}
