import { useRef, useState, type ChangeEvent } from "react";
import { findActiveMentionQuery, insertMentionToken } from "./mention-query.util";
import type { AssigneeSummary } from "./assignee-summary";

export function useMentionAutocomplete(content: string, setContent: (content: string) => void) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeMentionQuery, setActiveMentionQuery] = useState<string | null>(null);

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const newContent = event.target.value;
    setContent(newContent);
    setActiveMentionQuery(findActiveMentionQuery(newContent, event.target.selectionStart));
  }

  function handleSelectMention(member: AssigneeSummary) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    const result = insertMentionToken(content, textarea.selectionStart, member.fullName, member.id);
    setContent(result.content);
    setActiveMentionQuery(null);
    focusTextareaAtPosition(textarea, result.cursorPosition);
  }

  return { textareaRef, activeMentionQuery, handleContentChange, handleSelectMention };
}

function focusTextareaAtPosition(textarea: HTMLTextAreaElement, position: number) {
  textarea.focus();
  requestAnimationFrame(() => textarea.setSelectionRange(position, position));
}
