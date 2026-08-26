import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useLocation } from "wouter";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
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
import { createOrganization } from "./create-organization.api";
import { OrganizationApiError } from "./organization-api-error";

export function CreateOrganizationForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "" },
  });

  const createOrganizationMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      applyCreateOrganizationErrorToForm(error, form, toast);
    },
  });

  function onSubmit(input: CreateOrganizationInput) {
    createOrganizationMutation.mutate(input);
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
                <Input placeholder="Mi empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createOrganizationMutation.isPending}>
          {createOrganizationMutation.isPending ? "Creando..." : "Crear organización"}
        </Button>
      </form>
    </Form>
  );
}

function applyCreateOrganizationErrorToForm(
  error: unknown,
  form: UseFormReturn<CreateOrganizationInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof OrganizationApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo crear la organización",
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
    title: "No se pudo crear la organización",
    description: error.message,
  });
}
