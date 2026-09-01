import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMentionAutocomplete } from "./use-mention-autocomplete";
import { MentionAutocomplete } from "./MentionAutocomplete";

type CommentEditFormProps = {
  organizationId: string;
  initialContent: string;
  isSaving: boolean;
  onSave: (content: string) => void;
  onCancel: () => void;
};

export function CommentEditForm({
  organizationId,
  initialContent,
  isSaving,
  onSave,
  onCancel,
}: CommentEditFormProps) {
  const [content, setContent] = useState(initialContent);
  const { textareaRef, activeMentionQuery, handleContentChange, handleSelectMention } =
    useMentionAutocomplete(content, setContent);

  function handleSave() {
    if (content.trim().length === 0) {
      return;
    }
    onSave(content);
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea ref={textareaRef} value={content} onChange={handleContentChange} rows={3} autoFocus />
      {activeMentionQuery !== null && (
        <MentionAutocomplete
          organizationId={organizationId}
          query={activeMentionQuery}
          onSelectMember={handleSelectMention}
        />
      )}
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isSaving || content.trim().length === 0}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
