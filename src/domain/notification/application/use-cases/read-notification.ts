import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/Errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    notification: Notification;
  }
>;
@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({
      notification,
    });
  }
}
