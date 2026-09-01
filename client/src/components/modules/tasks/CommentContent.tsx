import { splitContentByMentions } from "@shared/utils/mention.util";

type CommentContentProps = {
  content: string;
};

// Separated from CommentItem so the mention-token parsing (turning
// @[Display Name](userId) into a chip) doesn't get mixed into the rest of a
// comment's rendering.
export function CommentContent({ content }: CommentContentProps) {
  const segments = splitContentByMentions(content);

  return (
    <p className="whitespace-pre-wrap text-sm text-foreground">
      {segments.map((segment, index) =>
        segment.type === "mention" ? (
          <span
            key={index}
            className="rounded bg-accent px-1 py-0.5 font-medium text-accent-foreground"
          >
            @{segment.displayName}
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </p>
  );
}
