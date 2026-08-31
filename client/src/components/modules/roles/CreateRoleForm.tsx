import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { createRoleSchema, type CreateRoleInput } from "@shared/schemas/role.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { setFieldErrorsOnForm } from "@/components/modules/auth/apply-field-errors";
import { useCreateRole } from "./use-create-role";
import { RolesApiError } from "./roles-api-error";

type CreateRoleFormProps = {
  organizationId: string;
};

export function CreateRoleForm({ organizationId }: CreateRoleFormProps) {
  const { toast } = useToast();
  const { createRole, isPending } = useCreateRole(organizationId);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: "", description: "" },
  });

  function onSubmit(input: CreateRoleInput) {
    createRole(input, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset({ name: "", description: "" });
        toast({ title: "Rol creado", description: `Se creó el rol "${input.name}".` });
      },
      onError: (error) => applyCreateRoleErrorToForm(error, form, toast),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Crear rol</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear rol</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Editor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Para qué se usa este rol"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creando..." : "Crear rol"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function applyCreateRoleErrorToForm(
  error: unknown,
  form: UseFormReturn<CreateRoleInput>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof RolesApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo crear el rol",
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
    title: "No se pudo crear el rol",
    description: error.message,
  });
}
