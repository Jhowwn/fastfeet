import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { DeliveryRepository } from "@/domain/delivery/application/repositories/delivery-repository";
import { Delivery } from "@/domain/delivery/enterprise/entities/delivery";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryDeliveryAttachmentsRepository } from "./in-memory-delivery-attachments-repository";

export class InMemoryDeliverysRepository implements DeliveryRepository {
  public items: Delivery[] = [];
  constructor(
    private deliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
  ) {}

  async findById(deliveryId: string) {
    const delivery = this.items.find(
      (item) => item.id.toString() === deliveryId,
    );

    if (!delivery) {
      return null;
    }

    return delivery;
  }

  async findManyByRecipientId(recipientId: string, { page }: PaginationParams) {
    const deliveries = this.items
      .filter((item) => item.recipientId.toString() === recipientId)
      .slice((page - 1) * 20, page * 20);

    return deliveries;
  }

  async findManyByCourierId(courierId: string, { page }: PaginationParams) {
    const deliveries = this.items
      .filter((item) => item.courierId.toString() === courierId)
      .slice((page - 1) * 20, page * 20);

    return deliveries;
  }

  async create(delivery: Delivery) {
    this.items.push(delivery);
    DomainEvents.dispatchEventsForAggregate(delivery.id);
  }

  async save(delivery: Delivery) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === delivery.id.toString(),
    );

    if (delivery.status === "Entregue") {
      await this.deliveryAttachmentsRepository.createMany(
        delivery.attachments.getNewItems(),
      );

      await this.deliveryAttachmentsRepository.deleteMany(
        delivery.attachments.getRemovedItems(),
      );
    }

    this.items[itemIndex] = delivery;

    DomainEvents.dispatchEventsForAggregate(delivery.id);
  }

  async delete(delivery: Delivery) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === delivery.id.toString(),
    );

    this.items.splice(itemIndex, 1);

    this.deliveryAttachmentsRepository.deleteManyByDeliveryId(
      delivery.id.toString(),
    );
  }
}
