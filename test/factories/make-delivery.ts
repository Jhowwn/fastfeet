import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Delivery,
  DeliveryProps,
} from "@/domain/delivery/enterprise/entities/delivery";
import { PrismaDeliveryMapper } from "@/infra/database/prisma/mapper/prisma-delivery-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeDelivery(
  override: Partial<DeliveryProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Delivery.create(
    {
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
      status: "Aguardando",
      courierId: new UniqueEntityID(),
      recipientId: new UniqueEntityID(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  );

  return recipient;
}

@Injectable()
export class DeliveryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivery(
    data: Partial<DeliveryProps> = {},
  ): Promise<Delivery> {
    const delivery = makeDelivery(data);

    await this.prisma.delivery.create({
      data: PrismaDeliveryMapper.toPrisma(delivery),
    });

    return delivery;
  }
}
