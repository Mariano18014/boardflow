import { Switch, Route } from "wouter";
import { RequireNoOrganization } from "@/components/modules/organizations/RequireNoOrganization";
import { RequireOrganization } from "@/components/modules/organizations/RequireOrganization";
import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProjectPage from "@/pages/projects/ProjectPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import BoardPage from "@/pages/boards/BoardPage";
import BacklogPage from "@/pages/backlog/BacklogPage";
import MembersPage from "@/pages/members/MembersPage";
import OrganizationSettingsPage from "@/pages/organizations/OrganizationSettingsPage";
import RolesPage from "@/pages/roles/RolesPage";
import InvitationPage from "@/pages/invitations/InvitationPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

// A medida que se implementen los modulos (auth, organizations, projects, boards, backlog, sprints...)
// cada uno agrega sus <Route> aqui.
export function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/invitations/:token" component={InvitationPage} />
      <Route path="/onboarding">
        <RequireNoOrganization component={OnboardingPage} />
      </Route>
      <Route path="/dashboard">
        <RequireOrganization component={DashboardPage} />
      </Route>
      <Route path="/projects">
        <RequireOrganization component={ProjectsPage} />
      </Route>
      <Route path="/projects/:projectId">
        <RequireOrganization component={ProjectPage} />
      </Route>
      <Route path="/projects/:projectId/backlog">
        <RequireOrganization component={BacklogPage} />
      </Route>
      <Route path="/boards/:boardId">
        <RequireOrganization component={BoardPage} />
      </Route>
      <Route path="/members">
        <RequireOrganization component={MembersPage} />
      </Route>
      <Route path="/settings">
        <RequireOrganization component={OrganizationSettingsPage} />
      </Route>
      <Route path="/settings/roles">
        <RequireOrganization component={RolesPage} />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}
