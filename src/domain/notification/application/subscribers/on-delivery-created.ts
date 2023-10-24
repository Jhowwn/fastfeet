import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { DeliveryRepository } from "@/domain/delivery/application/repositories/delivery-repository";
import { DeliveryCreatedEvent } from "@/domain/delivery/enterprise/events/delivery-created-event";
import { Injectable } from "@nestjs/common";
import { SendNotificationUseCase } from "../use-cases/send-notification";

@Injectable()
export class OnDeliveryCreated implements EventHandler {
  constructor(
    private deliveryRepository: DeliveryRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewDeliveryNotification.bind(this),
      DeliveryCreatedEvent.name,
    );
  }

  private async sendNewDeliveryNotification({
    delivery,
  }: DeliveryCreatedEvent) {
    console.log(delivery);
    const deliveryResult = await this.deliveryRepository.findById(
      delivery.id.toString(),
    );

    if (deliveryResult) {
      await this.sendNotification.execute({
        recipientId: delivery.id.toString(),
        title: `Nova encomenda em "${delivery.status}"`,
        content: delivery.status,
      });
    }
  }
}
