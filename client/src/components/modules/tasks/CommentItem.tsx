import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthSession } from "@/components/modules/auth/use-auth-session";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { AssigneeAvatar } from "./AssigneeAvatar";
import { CommentEditForm } from "./CommentEditForm";
import { formatCommentDate } from "./format-comment-date.util";
import { useEditComment } from "./use-edit-comment";
import { useDeleteComment } from "./use-delete-comment";
import { TaskApiError } from "./task-api-error";
import type { TaskComment } from "./comment-summary";

type CommentItemProps = {
  organizationId: string;
  projectId: string;
  taskId: string;
  comment: TaskComment;
};

export function CommentItem({ organizationId, projectId, taskId, comment }: CommentItemProps) {
  const session = useAuthSession();
  const { hasPermission } = useHasPermission(organizationId);
  const { editComment, isEditingComment } = useEditComment(organizationId, projectId, taskId);
  const { deleteComment, isDeletingComment } = useDeleteComment(organizationId, projectId, taskId);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // The author can always edit/delete their own comment; comments:edit and
  // comments:delete let a moderator role act on someone else's, but that is
  // not granted to a regular member by default.
  const isAuthor = session?.user.id === comment.author.id;
  const canEdit = isAuthor || hasPermission("comments:edit");
  const canDelete = isAuthor || hasPermission("comments:delete");

  function startEditing() {
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveEdit(content: string) {
    editComment(
      { commentId: comment.id, content },
      {
        onSuccess: () => setIsEditing(false),
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "No se pudo editar el comentario",
            description: error instanceof TaskApiError ? error.message : "Probá de nuevo.",
          });
        },
      },
    );
  }

  function requestDelete() {
    setIsConfirmDeleteOpen(true);
  }

  function cancelDelete() {
    setIsConfirmDeleteOpen(false);
  }

  function confirmDelete() {
    deleteComment(comment.id, {
      onSettled: () => setIsConfirmDeleteOpen(false),
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "No se pudo eliminar el comentario",
          description: error instanceof TaskApiError ? error.message : "Probá de nuevo.",
        });
      },
    });
  }

  return (
    <div className="group flex items-start gap-2.5">
      <AssigneeAvatar assignee={comment.author} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{comment.author.fullName}</span>
          <span className="text-xs text-muted-foreground">{formatCommentDate(comment.createdAt)}</span>
          {comment.editedAt !== null && <span className="text-xs text-muted-foreground">(editado)</span>}
        </div>

        {isEditing ? (
          <CommentEditForm
            initialContent={comment.content}
            isSaving={isEditingComment}
            onSave={saveEdit}
            onCancel={cancelEditing}
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>
        )}

        {!isEditing && (canEdit || canDelete) && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {canEdit && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={startEditing}>
                Editar
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={requestDelete}
                disabled={isDeletingComment}
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={isConfirmDeleteOpen}
        title="Eliminar comentario"
        description="¿Confirmás eliminar este comentario? No vas a poder deshacer esto desde la interfaz."
        confirmLabel="Eliminar"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
