import { buildMentionToken } from "@shared/utils/mention.util";

export function findActiveMentionQuery(content: string, cursorPosition: number): string | null {
  const textBeforeCursor = content.slice(0, cursorPosition);
  const atIndex = textBeforeCursor.lastIndexOf("@");
  if (atIndex === -1) {
    return null;
  }
  const textAfterAt = textBeforeCursor.slice(atIndex + 1);
  const mentionIsStillInProgress = !/[\s[\]()]/.test(textAfterAt);
  if (!mentionIsStillInProgress) {
    return null;
  }
  return textAfterAt;
}

export type InsertMentionResult = {
  content: string;
  cursorPosition: number;
};

export function insertMentionToken(
  content: string,
  cursorPosition: number,
  displayName: string,
  userId: string,
): InsertMentionResult {
  const textBeforeCursor = content.slice(0, cursorPosition);
  const atIndex = textBeforeCursor.lastIndexOf("@");
  const textBeforeAt = content.slice(0, atIndex);
  const textAfterCursor = content.slice(cursorPosition);
  const token = `${buildMentionToken(displayName, userId)} `;
  return {
    content: `${textBeforeAt}${token}${textAfterCursor}`,
    cursorPosition: textBeforeAt.length + token.length,
  };
}
