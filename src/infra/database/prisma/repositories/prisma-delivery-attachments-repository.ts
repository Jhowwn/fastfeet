import { DeliveryAttachmentsRepository } from "@/domain/delivery/application/repositories/delivery-attachments-repository";
import { DeliveryAttachment } from "@/domain/delivery/enterprise/entities/delivery-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaDeliveryAttachmentMapper } from "../mapper/prisma-delivery-attachment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaDeliveryAttachmentsRepository
  implements DeliveryAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByDeliveryId(
    deliverieId: string,
  ): Promise<DeliveryAttachment[]> {
    const deliveryAttachments = await this.prisma.attachment.findMany({
      where: {
        deliverieId,
      },
    });

    return deliveryAttachments.map(PrismaDeliveryAttachmentMapper.toDomain);
  }

  async createMany(attachments: DeliveryAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaDeliveryAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: DeliveryAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString();
    });

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }

  async deleteManyByDeliveryId(deliverieId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        deliverieId,
      },
    });
  }
}
