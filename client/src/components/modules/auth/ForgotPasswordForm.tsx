import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@shared/schemas/password-reset-token.schema";
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
import { requestPasswordReset } from "./forgot-password.api";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (response) => {
      setConfirmationMessage(response.message);
    },
    onError: (error) => {
      applyForgotPasswordErrorToForm(error, form, toast);
    },
  });

  function onSubmit(input: ForgotPasswordInput) {
    forgotPasswordMutation.mutate(input);
  }

  if (confirmationMessage) {
    return <p className="text-sm text-muted-foreground">{confirmationMessage}</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending ? "Enviando..." : "Enviar instrucciones"}
        </Button>
      </form>
    </Form>
  );
}

function applyForgotPasswordErrorToForm(
  error: unknown,
  form: UseFormReturn<ForgotPasswordInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof AuthApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo procesar la solicitud",
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
    title: "No se pudo procesar la solicitud",
    description: error.message,
  });
}
