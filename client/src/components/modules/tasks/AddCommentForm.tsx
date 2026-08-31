import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateComment } from "./use-create-comment";
import { TaskApiError } from "./task-api-error";

type AddCommentFormProps = {
  organizationId: string;
  projectId: string;
  taskId: string;
};

// Unlike the rest of the detail panel (title, description, assignees, labels
// — all held in local state and only sent on "Guardar cambios"), a comment is
// published immediately on submit. It has its own mutation and its own
// "Publicar" button instead of joining handleSave's batch of changes.
export function AddCommentForm({ organizationId, projectId, taskId }: AddCommentFormProps) {
  const { createComment, isCreatingComment } = useCreateComment(organizationId, projectId, taskId);
  const { toast } = useToast();
  const [content, setContent] = useState("");

  function handleSubmit() {
    if (content.trim().length === 0) {
      return;
    }
    createComment(content, {
      onSuccess: () => setContent(""),
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "No se pudo publicar el comentario",
          description: error instanceof TaskApiError ? error.message : "Probá de nuevo.",
        });
      },
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        placeholder="Escribí un comentario..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
      />
      <Button
        size="sm"
        className="self-end"
        onClick={handleSubmit}
        disabled={isCreatingComment || content.trim().length === 0}
      >
        {isCreatingComment ? "Publicando..." : "Publicar"}
      </Button>
    </div>
  );
}
