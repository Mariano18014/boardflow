// Shared action/entity type identifiers, so tasks (which logs these events)
// and sprints (which reads them back for the burndown chart) agree on the
// exact strings without either module hardcoding the other's literals.
export const TASK_ENTITY_TYPE = "task";
export const TASK_COMPLETED_ACTION = "task.completed";
export const TASK_REOPENED_ACTION = "task.reopened";

export const SPRINT_ENTITY_TYPE = "sprint";
export const SPRINT_CLOSED_ACTION = "sprint.closed";

// HU-44 organization-scoped actions: members, organizations, and projects
// each import the matching log*Activity function from activity-log.service
// instead of talking to the ActivityLog table directly.
export const INVITATION_ENTITY_TYPE = "invitation";
export const MEMBERSHIP_ENTITY_TYPE = "membership";
export const ORGANIZATION_ENTITY_TYPE = "organization";
export const PROJECT_ENTITY_TYPE = "project";

export const MEMBER_INVITED_ACTION = "member.invited";
export const MEMBER_ROLE_CHANGED_ACTION = "member.role_changed";
export const MEMBER_REMOVED_ACTION = "member.removed";
export const ORGANIZATION_UPDATED_ACTION = "organization.updated";
export const PROJECT_CREATED_ACTION = "project.created";
export const PROJECT_ARCHIVED_ACTION = "project.archived";
export const PROJECT_RESTORED_ACTION = "project.restored";
