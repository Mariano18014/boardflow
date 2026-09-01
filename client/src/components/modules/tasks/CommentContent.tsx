import { splitContentByMentions } from "@shared/utils/mention.util";

type CommentContentProps = {
  content: string;
};

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
