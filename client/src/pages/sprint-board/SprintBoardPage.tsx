import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";

export default function SprintBoardPage() {
  const { sprintId } = useParams<{ projectId: string; sprintId: string }>();

  return (
    <AppShell title="Tablero del sprint">
      <div className="p-7">
        <div className="text-xs font-mono text-text-3 mb-1">{sprintId}</div>
        <h1 className="font-heading text-xl font-bold mb-1">Tablero del sprint</h1>
        <p className="text-sm text-muted-foreground">
          El tablero con las columnas To Do / In Progress / Review / Done todavía no está
          implementado.
        </p>
      </div>
    </AppShell>
  );
}
