import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();

  return (
    <AppShell title="Tablero">
      <div className="p-7">
        <div className="text-xs font-mono text-text-3 mb-1">{boardId}</div>
        <h1 className="font-heading text-xl font-bold mb-1">Tablero</h1>
        <p className="text-sm text-muted-foreground">
          Las columnas y tareas de este tablero todavía no están implementadas.
        </p>
      </div>
    </AppShell>
  );
}
