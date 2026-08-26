import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useLocation, useSearch } from "wouter";
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
import { setFieldErrorsOnForm } from "./apply-field-errors";
import { AuthApiError } from "./auth-api-error";
import { resetPasswordFormSchema, type ResetPasswordFormInput } from "./reset-password-form.schema";
import { resetPassword } from "./reset-password.api";

export function ResetPasswordForm() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const resetToken = extractResetTokenFromSearch(search);

  const form = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { token: resetToken, password: "", confirmPassword: "" },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "Ya podés iniciar sesión con tu nueva contraseña.",
      });
      navigate("/login");
    },
    onError: (error) => {
      applyResetPasswordErrorToForm(error, form, toast);
    },
  });

  function onSubmit(input: ResetPasswordFormInput) {
    resetPasswordMutation.mutate({ token: input.token, password: input.password });
  }

  if (!resetToken) {
    return (
      <p className="text-sm text-muted-foreground">
        El enlace de recuperación no es válido. Solicitá uno nuevo desde "Olvidé mi contraseña".
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="password"
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Repetí tu nueva contraseña" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? "Actualizando..." : "Actualizar contraseña"}
        </Button>
      </form>
    </Form>
  );
}

function extractResetTokenFromSearch(search: string): string {
  const params = new URLSearchParams(search);
  return params.get("token") ?? "";
}

function applyResetPasswordErrorToForm(
  error: unknown,
  form: UseFormReturn<ResetPasswordFormInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof AuthApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo actualizar la contraseña",
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
    title: "No se pudo actualizar la contraseña",
    description: error.message,
  });
}
