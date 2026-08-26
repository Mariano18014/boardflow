import { useQuery } from "@tanstack/react-query";

type HealthResponse = { status: string };

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery<HealthResponse>({
    queryKey: ["/api/health"],
  });

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-2">
      <h1 className="text-2xl font-heading font-semibold">BoardFlow</h1>
      <p className="text-muted-foreground">Arquitectura base lista. Modulos por implementar.</p>
      <p className="text-sm text-muted-foreground" data-testid="health-status">
        {isLoading && "Consultando /api/health..."}
        {isError && `Error consultando /api/health: ${(error as Error).message}`}
        {data && `/api/health respondio: ${JSON.stringify(data)}`}
      </p>
    </div>
  );
}
