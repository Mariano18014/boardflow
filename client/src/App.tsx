import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppearanceProvider } from "@/context/appearance-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppRoutes } from "@/routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppearanceProvider>
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </TooltipProvider>
      </AppearanceProvider>
    </QueryClientProvider>
  );
}

export default App;
