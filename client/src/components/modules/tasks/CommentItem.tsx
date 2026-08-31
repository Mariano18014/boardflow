import { AssigneeAvatar } from "./AssigneeAvatar";
import { formatCommentDate } from "./format-comment-date.util";
import type { TaskComment } from "./comment-summary";

type CommentItemProps = {
  comment: TaskComment;
};

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex items-start gap-2.5">
      <AssigneeAvatar assignee={comment.author} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{comment.author.fullName}</span>
          <span className="text-xs text-muted-foreground">{formatCommentDate(comment.createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>
      </div>
    </div>
  );
}
