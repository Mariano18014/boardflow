import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import {
  createInvitationSchema,
  type CreateInvitationInput,
} from "@shared/schemas/invitation.schema";
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
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { setFieldErrorsOnForm } from "@/components/modules/auth/apply-field-errors";
import { RoleSelectOptions } from "@/components/modules/roles/RoleSelectOptions";
import { useRoles } from "@/components/modules/roles/use-roles";
import { inviteMember } from "./invite-member.api";
import { InvitationApiError } from "./invitation-api-error";

type InviteMemberFormProps = {
  organizationId: string;
};

export function InviteMemberForm({ organizationId }: InviteMemberFormProps) {
  const { toast } = useToast();
  const { data: roles } = useRoles(organizationId);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<CreateInvitationInput>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: { email: "", roleId: "" },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: (input: CreateInvitationInput) => inviteMember(input, organizationId),
    onSuccess: (invitation) => {
      setSuccessMessage(`Invitación enviada a ${invitation.email}.`);
      form.reset({ email: "", roleId: "" });
    },
    onError: (error) => {
      applyInviteMemberErrorToForm(error, form, toast);
    },
  });

  function onSubmit(input: CreateInvitationInput) {
    setSuccessMessage(null);
    inviteMemberMutation.mutate(input);
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
                <Input type="email" placeholder="persona@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegí un rol" />
                  </SelectTrigger>
                </FormControl>
                <RoleSelectOptions roles={roles} />
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {successMessage && <p className="text-sm text-success">{successMessage}</p>}
        <Button type="submit" disabled={inviteMemberMutation.isPending}>
          {inviteMemberMutation.isPending ? "Enviando..." : "Invitar"}
        </Button>
      </form>
    </Form>
  );
}

function applyInviteMemberErrorToForm(
  error: unknown,
  form: UseFormReturn<CreateInvitationInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof InvitationApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo enviar la invitación",
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
    title: "No se pudo enviar la invitación",
    description: error.message,
  });
}
