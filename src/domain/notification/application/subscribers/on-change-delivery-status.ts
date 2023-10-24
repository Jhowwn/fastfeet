import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { DeliveryRepository } from "@/domain/delivery/application/repositories/delivery-repository";
import { DeliveryChangeStatusEvent } from "@/domain/delivery/enterprise/events/delivery-change-status-event";
import { Injectable } from "@nestjs/common";
import { SendNotificationUseCase } from "../use-cases/send-notification";

@Injectable()
export class OnChangeDeliveryStatus implements EventHandler {
  constructor(
    private deliveryRepository: DeliveryRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendDeliveryStatusNotification.bind(this),
      DeliveryChangeStatusEvent.name,
    );
  }

  private async sendDeliveryStatusNotification({
    delivery,
    deliveryId,
  }: DeliveryChangeStatusEvent) {
    const deliveryResult = await this.deliveryRepository.findById(
      deliveryId.toString(),
    );

    if (deliveryResult) {
      await this.sendNotification.execute({
        recipientId: delivery.id.toString(),
        title: `O status da sua encomenda mudou!`,
        content: `Encomenda "${delivery.status}`,
      });
    }
  }
}
