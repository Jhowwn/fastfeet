import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Delivery } from "../entities/delivery";

export class DeliveryChangeStatusEvent implements DomainEvent {
  public ocurredAt: Date;
  public delivery: Delivery;
  public deliveryId: UniqueEntityID;

  constructor(delivery: Delivery, deliveryId: UniqueEntityID) {
    this.delivery = delivery;
    this.deliveryId = deliveryId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id;
  }
}
