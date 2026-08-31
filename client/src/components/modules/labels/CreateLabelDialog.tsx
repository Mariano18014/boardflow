import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { createLabelBodySchema, type CreateLabelBody } from "@shared/schemas/label.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useToast } from "@/hooks/use-toast";
import { setFieldErrorsOnForm } from "@/components/modules/auth/apply-field-errors";
import { useCreateLabel } from "./use-create-label";
import { LabelApiError } from "./label-api-error";

type CreateLabelDialogProps = {
  organizationId: string;
  projectId: string;
};

const DEFAULT_VALUES: CreateLabelBody = { name: "", color: "#4F46E5" };

export function CreateLabelDialog({ organizationId, projectId }: CreateLabelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { createLabel, isCreatingLabel } = useCreateLabel(organizationId, projectId);

  const form = useForm<CreateLabelBody>({
    resolver: zodResolver(createLabelBodySchema),
    defaultValues: DEFAULT_VALUES,
  });

  function onSubmit(input: CreateLabelBody) {
    createLabel(input, {
      onSuccess: () => {
        form.reset(DEFAULT_VALUES);
        setIsOpen(false);
        toast({ title: "Label creado", description: `Se creó el label "${input.name}".` });
      },
      onError: (error) => applyCreateLabelErrorToForm(error, form, toast),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Nuevo label</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Nuevo label</DialogTitle>
          <DialogDescription>Creá un label para categorizar tareas de este proyecto.</DialogDescription>
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
                    <Input placeholder="Bug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-9 w-12 cursor-pointer rounded-md border border-input p-1"
                        aria-label="Elegir color"
                      />
                      <Input
                        placeholder="#4F46E5"
                        value={field.value}
                        onChange={field.onChange}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isCreatingLabel}>
                {isCreatingLabel ? "Creando..." : "Crear label"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function applyCreateLabelErrorToForm(
  error: unknown,
  form: UseFormReturn<CreateLabelBody>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof LabelApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo crear el label",
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
    title: "No se pudo crear el label",
    description: error.message,
  });
}
