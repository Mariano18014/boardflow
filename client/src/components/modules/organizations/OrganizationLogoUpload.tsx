import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { describeUpdateOrganizationError, useUpdateOrganization } from "./use-update-organization";

const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

type OrganizationLogoUploadProps = {
  organizationId: string;
  organizationName: string;
  currentLogoUrl: string | null;
};

export function OrganizationLogoUpload({
  organizationId,
  organizationName,
  currentLogoUrl,
}: OrganizationLogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateOrganization, isPending } = useUpdateOrganization(organizationId);
  const { toast } = useToast();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    const error = checkLogoFileIsValid(file);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setPreviewUrl(URL.createObjectURL(file));
    updateOrganization(
      { logoFile: file },
      {
        onSuccess: () => setPreviewUrl(null),
        onError: (error) => {
          setPreviewUrl(null);
          toast({
            variant: "destructive",
            title: "No se pudo actualizar el logo",
            description: describeUpdateOrganizationError(error),
          });
        },
      },
    );
  }

  const displayedLogoUrl = previewUrl ?? currentLogoUrl;

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 rounded-md">
        {displayedLogoUrl && <AvatarImage src={displayedLogoUrl} alt={organizationName} />}
        <AvatarFallback className="rounded-md text-lg font-heading font-semibold">
          {getInitials(organizationName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openFilePicker}
          disabled={isPending}
        >
          {isPending ? "Subiendo..." : "Cambiar logo"}
        </Button>
        <p className="text-xs text-muted-foreground">JPG, PNG o SVG. Máximo 2MB.</p>
        {validationError && <p className="text-xs text-destructive">{validationError}</p>}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/svg+xml"
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
  );
}

function checkLogoFileIsValid(file: File): string | null {
  if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
    return "El logo debe ser un archivo JPG, PNG o SVG.";
  }
  if (file.size > MAX_LOGO_SIZE_BYTES) {
    return "El logo no puede superar los 2MB.";
  }
  return null;
}
