import { NotificationType } from "../domain/notificationTypes";

export function generateRedisKey(
  recipientEmail: string,
  type: NotificationType
): string {
  return `rate_limit:${recipientEmail}:${type}`;
}
