import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CommentEditFormProps = {
  initialContent: string;
  isSaving: boolean;
  onSave: (content: string) => void;
  onCancel: () => void;
};

export function CommentEditForm({ initialContent, isSaving, onSave, onCancel }: CommentEditFormProps) {
  const [content, setContent] = useState(initialContent);

  function handleSave() {
    if (content.trim().length === 0) {
      return;
    }
    onSave(content);
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea value={content} onChange={(event) => setContent(event.target.value)} rows={3} autoFocus />
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
