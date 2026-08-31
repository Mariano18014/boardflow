import type { TaskComment } from "./comment-summary";
import { CommentItem } from "./CommentItem";

type CommentsListProps = {
  comments: TaskComment[];
};

export function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay comentarios en esta tarea.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
