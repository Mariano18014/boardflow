import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useUpdateColumnWipLimit } from "./use-update-column-wip-limit";
import { BoardApiError } from "./board-api-error";

type WipLimitEditorProps = {
  organizationId: string;
  projectId: string;
  sprintId: string;
  columnId: string;
  wipLimit: number | null;
};

export function WipLimitEditor({ organizationId, projectId, sprintId, columnId, wipLimit }: WipLimitEditorProps) {
  const { updateColumnWipLimit, isUpdatingWipLimit } = useUpdateColumnWipLimit(
    organizationId,
    projectId,
    sprintId,
  );
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatWipLimitForInput(wipLimit));

  function openEditor(open: boolean) {
    if (open) {
      setInputValue(formatWipLimitForInput(wipLimit));
    }
    setIsOpen(open);
  }

  function saveWipLimit() {
    const parsedWipLimit = parseWipLimitFromInput(inputValue);
    updateColumnWipLimit(
      { columnId, wipLimit: parsedWipLimit },
      {
        onSuccess: () => setIsOpen(false),
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "No se pudo actualizar el límite WIP",
            description: error instanceof BoardApiError ? error.message : "Probá de nuevo.",
          });
        },
      },
    );
  }

  function removeWipLimit() {
    setInputValue("");
    updateColumnWipLimit(
      { columnId, wipLimit: null },
      {
        onSuccess: () => setIsOpen(false),
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "No se pudo actualizar el límite WIP",
            description: error instanceof BoardApiError ? error.message : "Probá de nuevo.",
          });
        },
      },
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={openEditor}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5" aria-label="Editar límite WIP">
          <Settings className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Límite WIP</p>
          <Input
            type="number"
            min={1}
            placeholder="Sin límite"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            {wipLimit !== null && (
              <Button variant="outline" size="sm" onClick={removeWipLimit} disabled={isUpdatingWipLimit}>
                Quitar límite
              </Button>
            )}
            <Button size="sm" onClick={saveWipLimit} disabled={isUpdatingWipLimit}>
              Guardar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function formatWipLimitForInput(wipLimit: number | null): string {
  return wipLimit === null ? "" : String(wipLimit);
}

function parseWipLimitFromInput(inputValue: string): number | null {
  const trimmedValue = inputValue.trim();
  if (trimmedValue.length === 0) {
    return null;
  }
  return Number(trimmedValue);
}
