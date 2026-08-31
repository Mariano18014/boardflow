import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
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
import { changePasswordFormSchema, type ChangePasswordFormInput } from "./change-password-form.schema";
import { useChangePassword } from "./use-change-password";
import { UserApiError } from "./user-api-error";

export function ChangePasswordForm() {
  const { toast } = useToast();
  const { changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  function onSubmit(input: ChangePasswordFormInput) {
    changePassword(
      { currentPassword: input.currentPassword, newPassword: input.newPassword },
      {
        onSuccess: () => {
          form.reset();
          toast({
            title: "Contraseña actualizada",
            description: "Tu contraseña se cambió correctamente. Cerramos tus otras sesiones activas.",
          });
        },
        onError: (error) => applyChangePasswordErrorToForm(error, form, toast),
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña actual</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nueva contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? "Guardando..." : "Cambiar contraseña"}
        </Button>
      </form>
    </Form>
  );
}

function applyChangePasswordErrorToForm(
  error: unknown,
  form: UseFormReturn<ChangePasswordFormInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof UserApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo cambiar la contraseña",
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
    title: "No se pudo cambiar la contraseña",
    description: error.message,
  });
}
