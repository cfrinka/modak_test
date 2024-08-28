import { Recipient } from "../domain/recipient";
import { NotificationType } from "../domain/notificationTypes";
import { RateLimitRepository } from "../infrastructure/rateLimitRepository";

export async function sendNotification(
  recipient: Recipient,
  type: NotificationType,
  rateLimitRepo: RateLimitRepository
): Promise<void> {
  const canSend = await rateLimitRepo.canSendNotification(recipient, type);

  if (canSend) {
    await rateLimitRepo.logNotification(recipient, type);
    console.log(`Notification sent to ${recipient.email} - ${type}`);
    // Here you would add the actual email sending logic
  } else {
    console.log(
      `Notification not sent to ${recipient.email} - ${type} due to rate limit.`
    );
  }
}
