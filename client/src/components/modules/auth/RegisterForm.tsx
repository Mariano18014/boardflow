import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useLocation } from "wouter";
import { registerUserSchema, type RegisterUserInput } from "@shared/schemas/user.schema";
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
import { AuthApiError } from "./auth-api-error";
import { registerUser } from "./register-user.api";

export function RegisterForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate("/onboarding");
    },
    onError: (error) => {
      applyRegisterErrorToForm(error, form, toast);
    },
  });

  function onSubmit(input: RegisterUserInput) {
    registerMutation.mutate(input);
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
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? "Creando cuenta..." : "Registrarme"}
        </Button>
      </form>
    </Form>
  );
}

function applyRegisterErrorToForm(
  error: unknown,
  form: UseFormReturn<RegisterUserInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof AuthApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo registrar",
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
    title: "No se pudo registrar",
    description: error.message,
  });
}

function setFieldErrorsOnForm(
  fieldErrors: Record<string, string[] | undefined>,
  form: UseFormReturn<RegisterUserInput>,
) {
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (!messages || messages.length === 0) continue;
    form.setError(field as keyof RegisterUserInput, { message: messages[0] });
  }
}
