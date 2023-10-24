import { Delivery } from "@/domain/delivery/enterprise/entities/delivery";

export class DeliveryPresenter {
  static toHTTP(delivery: Delivery) {
    return {
      id: delivery.id.toString(),
      title: delivery.title,
      description: delivery.description,
      courierId: delivery.courierId.toString(),
      recipientId: delivery.recipientId.toString(),
      latitude: delivery.latitude,
      longitude: delivery.longitude,
      status: delivery.status,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    };
  }
}
