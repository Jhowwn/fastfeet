import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/Errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { DeliveryAttachment } from "@/domain/delivery/enterprise/entities/delivery-attachment";
import { DeliveryAttachmentList } from "@/domain/delivery/enterprise/entities/delivery-attachments-list";
import { Injectable } from "@nestjs/common";
import { Delivery } from "../../../enterprise/entities/delivery";
import { DeliveryAttachmentsRepository } from "../../repositories/delivery-attachments-repository";
import { DeliveryRepository } from "../../repositories/delivery-repository";

type DeliveryStatus = "Aguardando" | "Retirada" | "Entregue" | "Devolvida";

interface EditDeliveryUseCaseRequest {
  courierId: string;
  deliveryId: string;
  title: string;
  description: string;
  status: DeliveryStatus;
  attachmentsIds?: string[];
}

type EditDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    delivery: Delivery;
  }
>;

@Injectable()
export class EditDeliveryUseCase {
  constructor(
    private deliveryRepository: DeliveryRepository,
    private deliveryAttachments: DeliveryAttachmentsRepository,
  ) {}

  async execute({
    courierId,
    deliveryId,
    title,
    description,
    status,
    attachmentsIds,
  }: EditDeliveryUseCaseRequest): Promise<EditDeliveryUseCaseResponse> {
    const delivery = await this.deliveryRepository.findById(deliveryId);

    if (!delivery) {
      return left(new ResourceNotFoundError());
    }

    if (courierId !== delivery.courierId.toString()) {
      return left(new NotAllowedError());
    }

    if (status === "Entregue") {
      const currentDeliveryAttachments =
        await this.deliveryAttachments.findManyByDeliveryId(deliveryId);

      const deliveryAttachmentsList = new DeliveryAttachmentList(
        currentDeliveryAttachments,
      );

      const deliveryAttachments = attachmentsIds.map((attachmentId) => {
        return DeliveryAttachment.create({
          attachmentId: new UniqueEntityID(attachmentId),
          deliveryId: delivery.id,
        });
      });

      deliveryAttachmentsList.update(deliveryAttachments);

      delivery.attachments = deliveryAttachmentsList;
    }

    delivery.title = title;
    delivery.description = description;
    delivery.status = status;

    await this.deliveryRepository.save(delivery);

    return right({
      delivery,
    });
  }
}
