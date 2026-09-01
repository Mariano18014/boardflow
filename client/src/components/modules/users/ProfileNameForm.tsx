import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { updateUserSchema, type UpdateUserInput } from "@shared/schemas/user.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { setFieldErrorsOnForm } from "@/components/modules/auth/apply-field-errors";
import { useUpdateMyProfile } from "./use-update-my-profile";
import { UserApiError } from "./user-api-error";

type ProfileNameFormProps = {
  currentFullName: string;
};

export function ProfileNameForm({ currentFullName }: ProfileNameFormProps) {
  const { toast } = useToast();
  const { updateMyProfile, isPending } = useUpdateMyProfile();

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { fullName: currentFullName },
  });

  function onSubmit(input: UpdateUserInput) {
    updateMyProfile(
      { fullName: input.fullName },
      { onError: (error) => applyUpdateProfileErrorToForm(error, form, toast) },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}

function applyUpdateProfileErrorToForm(
  error: unknown,
  form: UseFormReturn<UpdateUserInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof UserApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo guardar",
      description: "Ocurrió un error inesperado. Probá de nuevo en unos minutos.",
    });
    return;
  }

  if (error.fieldErrors) {
    setFieldErrorsOnForm(error.fieldErrors, form);
    return;
  }

  toast({
    variant: "destructive",
    title: "No se pudo guardar",
    description: error.message,
  });
}
