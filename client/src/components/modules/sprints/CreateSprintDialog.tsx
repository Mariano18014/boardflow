import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { createSprintBodySchema, type CreateSprintBody } from "@shared/schemas/sprint.schema";
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
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useToast } from "@/hooks/use-toast";
import { setFieldErrorsOnForm } from "@/components/modules/auth/apply-field-errors";
import { useCreateSprint } from "./use-create-sprint";
import { SprintApiError } from "./sprint-api-error";

type CreateSprintDialogProps = {
  organizationId: string;
  projectId: string;
};

const DEFAULT_VALUES: Partial<CreateSprintBody> = {
  name: "",
  goal: "",
};

export function CreateSprintDialog({ organizationId, projectId }: CreateSprintDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { createSprint, isPending } = useCreateSprint(organizationId, projectId);

  const form = useForm<CreateSprintBody>({
    resolver: zodResolver(createSprintBodySchema),
    defaultValues: DEFAULT_VALUES,
  });

  function onSubmit(input: CreateSprintBody) {
    createSprint(input, {
      onSuccess: () => {
        form.reset(DEFAULT_VALUES);
        setIsOpen(false);
        toast({ title: "Sprint creado", description: `Se creó el sprint "${input.name}".` });
      },
      onError: (error) => applyCreateSprintErrorToForm(error, form, toast),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          + Crear Sprint
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Crear Sprint</DialogTitle>
          <DialogDescription>Definí el nombre, objetivo y fechas del sprint.</DialogDescription>
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
                    <Input placeholder="Sprint 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Qué se espera lograr en este sprint"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <FormControl>
                    <DateTimePicker date={field.value} setDate={field.onChange} showTime={false} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de fin</FormLabel>
                  <FormControl>
                    <DateTimePicker date={field.value} setDate={field.onChange} showTime={false} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creando..." : "Crear sprint"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function applyCreateSprintErrorToForm(
  error: unknown,
  form: UseFormReturn<CreateSprintBody>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof SprintApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo crear el sprint",
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
    title: "No se pudo crear el sprint",
    description: error.message,
  });
}
