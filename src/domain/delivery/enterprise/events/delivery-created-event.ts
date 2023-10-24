import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Delivery } from "../entities/delivery";

export class DeliveryCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public delivery: Delivery;

  constructor(delivery: Delivery) {
    this.delivery = delivery;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id;
  }
}
