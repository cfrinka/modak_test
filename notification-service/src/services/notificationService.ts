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
    // TODO -> ADD E-MAIL SENDING CODE
  } else {
    console.log(
      `Notification not sent to ${recipient.email} due to rate limit of ${type}`
    );
  }
}
