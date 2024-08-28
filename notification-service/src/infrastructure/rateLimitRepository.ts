import { redisClient } from "./redisClient";
import { NotificationType } from "../domain/notificationTypes";
import { RateLimitRule, rateLimitRules } from "../domain/rateLimitRule";
import { Recipient } from "../domain/recipient";
import { generateRedisKey } from "../util/redisKeyGenerator";

export interface RateLimitRepository {
  canSendNotification(
    recipient: Recipient,
    type: NotificationType
  ): Promise<boolean>;
  logNotification(recipient: Recipient, type: NotificationType): Promise<void>;
}

export function createRedisRateLimitRepository(): RateLimitRepository {
  return {
    async canSendNotification(recipient, type) {
      const rule: RateLimitRule = rateLimitRules[type];
      const key = generateRedisKey(recipient.email, type);
      const currentTime = Date.now();

      await redisClient.zremrangebyscore(key, 0, currentTime - rule.duration);
      const notificationCount = await redisClient.zcard(key);

      return notificationCount < rule.limit;
    },

    async logNotification(recipient, type) {
      const key = generateRedisKey(recipient.email, type);
      const currentTime = Date.now();
      await redisClient.zadd(key, currentTime, currentTime.toString());
      await redisClient.expire(
        key,
        Math.ceil(rateLimitRules[type].duration / 1000)
      );
    },
  };
}
