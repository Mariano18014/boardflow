import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { describeUpdateProfileError, useUpdateMyProfile } from "./use-update-my-profile";

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

type ProfileAvatarUploadProps = {
  fullName: string;
  currentAvatarUrl: string | null;
};

export function ProfileAvatarUpload({ fullName, currentAvatarUrl }: ProfileAvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateMyProfile, isPending } = useUpdateMyProfile();
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

    const error = checkAvatarFileIsValid(file);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setPreviewUrl(URL.createObjectURL(file));
    updateMyProfile(
      { avatarFile: file },
      {
        onSuccess: () => setPreviewUrl(null),
        onError: (error) => {
          setPreviewUrl(null);
          toast({
            variant: "destructive",
            title: "No se pudo actualizar el avatar",
            description: describeUpdateProfileError(error),
          });
        },
      },
    );
  }

  const displayedAvatarUrl = previewUrl ?? currentAvatarUrl;

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        {displayedAvatarUrl && <AvatarImage src={displayedAvatarUrl} alt={fullName} />}
        <AvatarFallback className="text-lg font-heading font-semibold">
          {getInitials(fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <Button type="button" variant="outline" size="sm" onClick={openFilePicker} disabled={isPending}>
          {isPending ? "Subiendo..." : "Cambiar avatar"}
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

function checkAvatarFileIsValid(file: File): string | null {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return "El avatar debe ser un archivo JPG, PNG o SVG.";
  }
  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return "El avatar no puede superar los 2MB.";
  }
  return null;
}
