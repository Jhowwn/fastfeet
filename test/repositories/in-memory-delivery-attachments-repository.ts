import { DeliveryAttachmentsRepository } from "@/domain/delivery/application/repositories/delivery-attachments-repository";
import { DeliveryAttachment } from "@/domain/delivery/enterprise/entities/delivery-attachment";

export class InMemoryDeliveryAttachmentsRepository
  implements DeliveryAttachmentsRepository
{
  public items: DeliveryAttachment[] = [];

  async findManyByDeliveryId(deliveryId: string) {
    const deliveryAttachment = this.items.filter(
      (item) => item.deliveryId.toString() === deliveryId,
    );

    return deliveryAttachment;
  }

  async createMany(attachments: DeliveryAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: DeliveryAttachment[]): Promise<void> {
    const deliveryAttachment = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = deliveryAttachment;
  }

  async deleteManyByDeliveryId(deliveryId: string) {
    const deliveryAttachment = this.items.filter(
      (item) => item.deliveryId.toString() !== deliveryId,
    );

    this.items = deliveryAttachment;
  }
}
