import { NotificationType } from "./notificationTypes";

export interface RateLimitRule {
  limit: number; // Maximum number of notifications allowed
  duration: number; // Time frame in milliseconds
}

export const rateLimitRules: { [key in NotificationType]: RateLimitRule } = {
  [NotificationType.STATUS]: { limit: 2, duration: 60 * 1000 }, // 2 per minute
  [NotificationType.NEWS]: { limit: 1, duration: 24 * 60 * 60 * 1000 }, // 1 per day
  [NotificationType.MARKETING]: { limit: 3, duration: 60 * 60 * 1000 }, // 3 per hour
};
