import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import {
  updateOrganizationSchema,
  type UpdateOrganizationInput,
} from "@shared/schemas/organization.schema";
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
import { useUpdateOrganization } from "./use-update-organization";
import { OrganizationApiError } from "./organization-api-error";

type OrganizationSettingsFormProps = {
  organizationId: string;
  currentName: string;
};

export function OrganizationSettingsForm({
  organizationId,
  currentName,
}: OrganizationSettingsFormProps) {
  const { toast } = useToast();
  const { updateOrganization, isPending } = useUpdateOrganization(organizationId);

  const form = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: { name: currentName },
  });

  function onSubmit(input: UpdateOrganizationInput) {
    updateOrganization(
      { name: input.name },
      { onError: (error) => applyUpdateOrganizationErrorToForm(error, form, toast) },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la organización</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" {...field} />
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

function applyUpdateOrganizationErrorToForm(
  error: unknown,
  form: UseFormReturn<UpdateOrganizationInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof OrganizationApiError)) {
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
