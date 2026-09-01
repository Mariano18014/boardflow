import { Switch, Route } from "wouter";
import { RequireNoOrganization } from "@/components/modules/organizations/RequireNoOrganization";
import { RequireOrganization } from "@/components/modules/organizations/RequireOrganization";
import { RequireAuth } from "@/components/modules/auth/RequireAuth";
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
import SprintPlanningPage from "@/pages/sprint-planning/SprintPlanningPage";
import SprintBoardPage from "@/pages/sprint-board/SprintBoardPage";
import SprintHistoryPage from "@/pages/sprint-history/SprintHistoryPage";
import VelocityPage from "@/pages/velocity/VelocityPage";
import ProjectLabelsPage from "@/pages/project-labels/ProjectLabelsPage";
import MembersPage from "@/pages/members/MembersPage";
import OrganizationSettingsPage from "@/pages/organizations/OrganizationSettingsPage";
import OrganizationActivityPage from "@/pages/organizations/OrganizationActivityPage";
import RolesPage from "@/pages/roles/RolesPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import InvitationPage from "@/pages/invitations/InvitationPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

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
      <Route path="/projects/:projectId/sprint-planning">
        <RequireOrganization component={SprintPlanningPage} />
      </Route>
      <Route path="/projects/:projectId/sprints/:sprintId/board">
        <RequireOrganization component={SprintBoardPage} />
      </Route>
      <Route path="/projects/:projectId/sprints/:sprintId/history">
        <RequireOrganization component={SprintHistoryPage} />
      </Route>
      <Route path="/projects/:projectId/velocity">
        <RequireOrganization component={VelocityPage} />
      </Route>
      <Route path="/projects/:projectId/labels">
        <RequireOrganization component={ProjectLabelsPage} />
      </Route>
      <Route path="/boards/:boardId">
        <RequireOrganization component={BoardPage} />
      </Route>
      <Route path="/members">
        <RequireOrganization component={MembersPage} />
      </Route>
      <Route path="/profile">
        <RequireAuth component={ProfilePage} />
      </Route>
      <Route path="/settings">
        <RequireOrganization component={OrganizationSettingsPage} />
      </Route>
      <Route path="/settings/roles">
        <RequireOrganization component={RolesPage} />
      </Route>
      <Route path="/settings/activity">
        <RequireOrganization component={OrganizationActivityPage} />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}
