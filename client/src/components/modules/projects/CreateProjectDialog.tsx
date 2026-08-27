import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useLocation } from "wouter";
import { createProjectBodySchema, type CreateProjectBody } from "@shared/schemas/project.schema";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { useToast } from "@/hooks/use-toast";
import { setFieldErrorsOnForm } from "@/components/modules/auth/apply-field-errors";
import { createProject } from "./create-project.api";
import { ProjectApiError } from "./project-api-error";

type CreateProjectDialogProps = {
  organizationId: string;
};

const DEFAULT_VALUES: CreateProjectBody = { name: "", description: "" };

export function CreateProjectDialog({ organizationId }: CreateProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const form = useForm<CreateProjectBody>({
    resolver: zodResolver(createProjectBodySchema),
    defaultValues: DEFAULT_VALUES,
  });

  const createProjectMutation = useMutation({
    mutationFn: (input: CreateProjectBody) => createProject(organizationId, input),
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/projects", organizationId] });
      form.reset(DEFAULT_VALUES);
      setIsDescriptionOpen(false);
      setIsOpen(false);
      navigate(`/projects/${project.id}`);
    },
    onError: (error) => {
      applyCreateProjectErrorToForm(error, form, toast);
    },
  });

  function onSubmit(input: CreateProjectBody) {
    createProjectMutation.mutate(input);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Nuevo proyecto</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Nuevo proyecto</DialogTitle>
          <DialogDescription>Creá un proyecto dentro de tu organización.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile App Revamp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
              <CollapsibleTrigger asChild>
                <Button type="button" variant="link" size="sm" className="self-start px-0">
                  {isDescriptionOpen ? "Ocultar descripción" : "+ Agregar descripción (opcional)"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="De qué se trata este proyecto"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
            <DialogFooter>
              <Button type="submit" disabled={createProjectMutation.isPending}>
                {createProjectMutation.isPending ? "Creando..." : "Crear proyecto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function applyCreateProjectErrorToForm(
  error: unknown,
  form: UseFormReturn<CreateProjectBody>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof ProjectApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo crear el proyecto",
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
    title: "No se pudo crear el proyecto",
    description: error.message,
  });
}
