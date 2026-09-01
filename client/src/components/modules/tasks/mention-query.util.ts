import { buildMentionToken } from "@shared/utils/mention.util";

// Finds the "@query" the user is currently typing right before the cursor,
// e.g. "cc @pri" with the cursor at the end returns "pri". Returns null once
// the mention is no longer "in progress" (a space, a newline, or the start of
// a completed token breaks it).
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

// Replaces the in-progress "@query" (found via findActiveMentionQuery) with
// the full mention token, leaving the cursor right after it.
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
