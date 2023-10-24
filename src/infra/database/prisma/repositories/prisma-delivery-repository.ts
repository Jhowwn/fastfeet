import { PaginationParams } from "@/core/repositories/pagination-params";
import { DeliveryRepository } from "@/domain/delivery/application/repositories/delivery-repository";
import { Delivery } from "@/domain/delivery/enterprise/entities/delivery";
import { Injectable } from "@nestjs/common";
import { PrismaDeliveryMapper } from "../mapper/prisma-delivery-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaDeliverysRepository implements DeliveryRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: {
        id,
      },
    });

    if (!delivery) {
      return null;
    }

    return PrismaDeliveryMapper.toDomain(delivery);
  }

  async findManyByRecipientId(
    recipientId: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const delivery = await this.prisma.delivery.findMany({
      where: {
        recipientId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return delivery.map(PrismaDeliveryMapper.toDomain);
  }

  async findManyByCourierId(
    courierId: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const delivery = await this.prisma.delivery.findMany({
      where: {
        courierId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return delivery.map(PrismaDeliveryMapper.toDomain);
  }

  async create(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery);

    await this.prisma.delivery.create({
      data,
    });
  }

  async save(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery);

    await Promise.all([
      this.prisma.delivery.update({
        where: {
          id: delivery.id.toString(),
        },
        data,
      }),
    ]);
  }

  async delete(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery);

    await this.prisma.delivery.delete({
      where: {
        id: data.id,
      },
    });
  }
}
