import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { createBacklogTaskBodySchema, type CreateBacklogTaskBody } from "@shared/schemas/task.schema";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { setFieldErrorsOnForm } from "@/components/modules/auth/apply-field-errors";
import { useCreateBacklogTask } from "./use-create-backlog-task";
import { TaskApiError } from "./task-api-error";

type CreateBacklogTaskDialogProps = {
  organizationId: string;
  projectId: string;
};

const DEFAULT_VALUES: CreateBacklogTaskBody = {
  title: "",
  priority: "MEDIUM",
  estimatedPoints: 1,
};

const PRIORITY_OPTIONS: { value: CreateBacklogTaskBody["priority"]; label: string }[] = [
  { value: "LOW", label: "Baja" },
  { value: "MEDIUM", label: "Media" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];

export function CreateBacklogTaskDialog({ organizationId, projectId }: CreateBacklogTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { createBacklogTask, isPending } = useCreateBacklogTask(organizationId, projectId);

  const form = useForm<CreateBacklogTaskBody>({
    resolver: zodResolver(createBacklogTaskBodySchema),
    defaultValues: DEFAULT_VALUES,
  });

  function onSubmit(input: CreateBacklogTaskBody) {
    createBacklogTask(input, {
      onSuccess: () => {
        form.reset(DEFAULT_VALUES);
        setIsOpen(false);
      },
      onError: (error) => applyCreateBacklogTaskErrorToForm(error, form, toast),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Nueva tarea</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Nueva tarea</DialogTitle>
          <DialogDescription>Agregala al backlog de este proyecto.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Implementar login con Google" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Elegí una prioridad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimatedPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story points</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={field.value}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creando..." : "Crear tarea"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function applyCreateBacklogTaskErrorToForm(
  error: unknown,
  form: UseFormReturn<CreateBacklogTaskBody>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof TaskApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo crear la tarea",
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
    title: "No se pudo crear la tarea",
    description: error.message,
  });
}
