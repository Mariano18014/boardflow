import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useLocation } from "wouter";
import { loginUserSchema, type LoginUserInput } from "@shared/schemas/user.schema";
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
import { useAcceptInvitationOnAuth } from "@/components/modules/invitations/use-accept-invitation-on-auth";
import { setFieldErrorsOnForm } from "./apply-field-errors";
import { AuthApiError } from "./auth-api-error";
import { setSession } from "./auth-session.store";
import { loginUser } from "./login-user.api";

type LoginFormProps = {
  invitationToken?: string;
  lockedEmail?: string;
};

export function LoginForm({ invitationToken, lockedEmail }: LoginFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { acceptInvitationAfterAuth } = useAcceptInvitationOnAuth();

  const form = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: { email: lockedEmail ?? "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      setSession(response);
      if (invitationToken) {
        acceptInvitationAfterAuth(invitationToken);
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      applyLoginErrorToForm(error, form, toast);
    },
  });

  function onSubmit(input: LoginUserInput) {
    loginMutation.mutate(input);
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
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  readOnly={!!lockedEmail}
                  {...field}
                />
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
                <Input type="password" placeholder="Tu contraseña" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
}

function applyLoginErrorToForm(
  error: unknown,
  form: UseFormReturn<LoginUserInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof AuthApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo iniciar sesión",
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
    title: "No se pudo iniciar sesión",
    description: error.message,
  });
}
