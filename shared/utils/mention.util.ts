// Mention token format used inside Comment.content: @[Display Name](userId).
// The userId inside the parentheses is the only source of truth for who is
// mentioned — the display name is never parsed to look someone up (it's
// ambiguous, since two members can share a name).
const MENTION_TOKEN_PATTERN = /@\[([^\]]+)\]\(([^)]+)\)/g;

export type MentionToken = {
  displayName: string;
  userId: string;
};

export function buildMentionToken(displayName: string, userId: string): string {
  return `@[${displayName}](${userId})`;
}

export function extractMentionTokens(content: string): MentionToken[] {
  const matches = Array.from(content.matchAll(MENTION_TOKEN_PATTERN));
  return matches.map((match) => ({ displayName: match[1], userId: match[2] }));
}

export function extractMentionedUserIds(content: string): string[] {
  const tokens = extractMentionTokens(content);
  const userIds = tokens.map((token) => token.userId);
  return Array.from(new Set(userIds));
}

export function replaceMentionTokensWithDisplayNames(content: string): string {
  return content.replace(MENTION_TOKEN_PATTERN, (_match, displayName: string) => displayName);
}

export type MentionContentSegment =
  | { type: "text"; text: string }
  | { type: "mention"; displayName: string; userId: string };

// Used to render a comment's content with mention tokens shown as chips
// instead of the raw @[Display Name](userId) text.
export function splitContentByMentions(content: string): MentionContentSegment[] {
  const matches = Array.from(content.matchAll(MENTION_TOKEN_PATTERN));
  if (matches.length === 0) {
    return [{ type: "text", text: content }];
  }
  const segments: MentionContentSegment[] = [];
  let lastIndex = 0;
  for (const match of matches) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      segments.push({ type: "text", text: content.slice(lastIndex, matchIndex) });
    }
    segments.push({ type: "mention", displayName: match[1], userId: match[2] });
    lastIndex = matchIndex + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ type: "text", text: content.slice(lastIndex) });
  }
  return segments;
}
