import { PaginationParams } from "@/core/repositories/pagination-params";
import { DeliveryRepository } from "@/domain/delivery/application/repositories/delivery-repository";
import { Delivery } from "@/domain/delivery/enterprise/entities/delivery";

export class InMemoryDeliverysRepository implements DeliveryRepository {
  public items: Delivery[] = [];
  async create(delivery: Delivery) {
    this.items.push(delivery);
  }

  async save(delivery: Delivery) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === delivery.id.toString(),
    );

    this.items[itemIndex] = delivery;
  }

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

  async delete(delivery: Delivery) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === delivery.id.toString(),
    );

    this.items.splice(itemIndex, 1);
  }
}
