import type { Task } from "@prisma/client";
import type { CommentWithAuthor } from "@shared/schemas/comment.schema";
import { extractMentionedUserIds, replaceMentionTokensWithDisplayNames } from "@shared/utils/mention.util";
import { findActiveMembershipsByUserIds } from "../../../db/repositories/membership.repository";
import { findUserById } from "../../../db/repositories/user.repository";
import { createCommentMentionNotification } from "../../notifications/notifications.service";

const COMMENT_EXCERPT_LENGTH = 100;

export async function notifyMentionedUsers(
  content: string,
  comment: CommentWithAuthor,
  task: Task,
  organizationId: string,
  actorId: string,
  alreadyNotifiedIds: string[],
): Promise<void> {
  const mentionedIds = extractMentionedUserIds(content);
  const newMentionedIds = filterNewMentions(mentionedIds, alreadyNotifiedIds, actorId);
  if (newMentionedIds.length === 0) {
    return;
  }
  const validMentionedIds = await checkMentionedUsersAreActiveMembers(newMentionedIds, organizationId);
  await createCommentMentionNotifications(validMentionedIds, comment, task, organizationId, actorId);
}

function filterNewMentions(mentionedIds: string[], alreadyNotifiedIds: string[], actorId: string): string[] {
  const alreadyNotified = new Set(alreadyNotifiedIds);
  return mentionedIds.filter((userId) => !alreadyNotified.has(userId) && userId !== actorId);
}

async function checkMentionedUsersAreActiveMembers(
  userIds: string[],
  organizationId: string,
): Promise<string[]> {
  if (userIds.length === 0) {
    return [];
  }
  const activeMemberships = await findActiveMembershipsByUserIds(organizationId, userIds);
  const activeUserIds = new Set(activeMemberships.map((membership) => membership.userId));
  return userIds.filter((userId) => activeUserIds.has(userId));
}

async function createCommentMentionNotifications(
  userIds: string[],
  comment: CommentWithAuthor,
  task: Task,
  organizationId: string,
  actorId: string,
): Promise<void> {
  const actor = await findUserById(actorId);
  const commentExcerpt = buildCommentExcerpt(comment.content);
  for (const userId of userIds) {
    await createCommentMentionNotification(userId, {
      commentId: comment.id,
      taskId: task.id,
      taskTitle: task.title,
      projectId: task.projectId,
      organizationId,
      mentionedByUserId: actorId,
      mentionedByName: actor?.fullName ?? "",
      commentExcerpt,
    });
  }
}

function buildCommentExcerpt(content: string): string {
  const plainContent = replaceMentionTokensWithDisplayNames(content);
  return plainContent.slice(0, COMMENT_EXCERPT_LENGTH);
}
