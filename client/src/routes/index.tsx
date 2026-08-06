import { Switch, Route } from "wouter";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

// A medida que se implementen los modulos (auth, organizations, projects, boards, backlog, sprints...)
// cada uno agrega sus <Route> aqui.
export function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
