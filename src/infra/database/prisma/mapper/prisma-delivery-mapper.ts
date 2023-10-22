import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Delivery } from "@/domain/delivery/enterprise/entities/delivery";
import { Prisma, Delivery as PrismaDelivery } from "@prisma/client";

export class PrismaDeliveryMapper {
  static toDomain(raw: PrismaDelivery): Delivery {
    return Delivery.create(
      {
        title: raw.title,
        description: raw.description,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
        status: "Aguardando",
        courierId: new UniqueEntityID(),
        recipientId: new UniqueEntityID(),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: delivery.id.toString(),
      title: delivery.title,
      description: delivery.description,
      latitude: delivery.latitude,
      longitude: delivery.longitude,
      status: "Aguardando",
      courierId: delivery.courierId.toString(),
      recipientId: delivery.recipientId.toString(),
    };
  }
}
