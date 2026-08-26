import { Switch, Route } from "wouter";
import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

// A medida que se implementen los modulos (auth, organizations, projects, boards, backlog, sprints...)
// cada uno agrega sus <Route> aqui.
export function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
