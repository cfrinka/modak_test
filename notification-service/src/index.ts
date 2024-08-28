import { redisClient } from "./infrastructure/redisClient";
import { createRedisRateLimitRepository } from "./infrastructure/rateLimitRepository";
import { sendNotification } from "./application/notificationService";
import { NotificationType } from "./domain/notificationTypes";
import { Recipient } from "./domain/recipient";

(async () => {
  const rateLimitRepo = createRedisRateLimitRepository(); // Create the repository

  const recipient: Recipient = { email: "user1@example.com" };

  // Attempt to send notifications
  await sendNotification(recipient, NotificationType.STATUS, rateLimitRepo); // Should send
  await sendNotification(recipient, NotificationType.STATUS, rateLimitRepo); // Should send
  await sendNotification(recipient, NotificationType.STATUS, rateLimitRepo); // Should reject due to rate limit

  await sendNotification(recipient, NotificationType.NEWS, rateLimitRepo); // Should send
  await sendNotification(recipient, NotificationType.NEWS, rateLimitRepo); // Should reject due to rate limit

  redisClient.disconnect(); // Clean up Redis client connection
})();
