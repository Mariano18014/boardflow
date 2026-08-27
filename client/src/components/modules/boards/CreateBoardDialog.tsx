import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useLocation } from "wouter";
import { createBoardBodySchema, type CreateBoardBody } from "@shared/schemas/board.schema";
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
import { createBoard } from "./create-board.api";
import { BoardApiError } from "./board-api-error";

type CreateBoardDialogProps = {
  organizationId: string;
  projectId: string;
};

const DEFAULT_VALUES: CreateBoardBody = { name: "" };

export function CreateBoardDialog({ organizationId, projectId }: CreateBoardDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const form = useForm<CreateBoardBody>({
    resolver: zodResolver(createBoardBodySchema),
    defaultValues: DEFAULT_VALUES,
  });

  const createBoardMutation = useMutation({
    mutationFn: (input: CreateBoardBody) => createBoard(organizationId, projectId, input),
    onSuccess: async (board) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "boards"] });
      form.reset(DEFAULT_VALUES);
      setIsOpen(false);
      navigate(`/boards/${board.id}`);
    },
    onError: (error) => {
      applyCreateBoardErrorToForm(error, form, toast);
    },
  });

  function onSubmit(input: CreateBoardBody) {
    createBoardMutation.mutate(input);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Nuevo tablero</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Nuevo tablero</DialogTitle>
          <DialogDescription>Creá un tablero dentro de este proyecto.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del tablero</FormLabel>
                  <FormControl>
                    <Input placeholder="Sprint 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createBoardMutation.isPending}>
                {createBoardMutation.isPending ? "Creando..." : "Crear tablero"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function applyCreateBoardErrorToForm(
  error: unknown,
  form: UseFormReturn<CreateBoardBody>,
  toast: ReturnType<typeof useToast>["toast"],
) {
  if (!(error instanceof BoardApiError)) {
    toast({
      variant: "destructive",
      title: "No se pudo crear el tablero",
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
    title: "No se pudo crear el tablero",
    description: error.message,
  });
}
