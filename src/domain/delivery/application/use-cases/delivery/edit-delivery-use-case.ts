import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/Errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { Injectable } from "@nestjs/common";
import { Delivery } from "../../../enterprise/entities/delivery";
import { DeliveryRepository } from "../../repositories/delivery-repository";

type DeliveryStatus = "Aguardando" | "Retirada" | "Entregue" | "Devolvida";

interface EditDeliveryUseCaseRequest {
  deliveryId: string;
  title: string;
  description: string;
  status: DeliveryStatus;
}

type EditDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    delivery: Delivery;
  }
>;

@Injectable()
export class EditDeliveryUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  async execute({
    deliveryId,
    title,
    description,
    status,
  }: EditDeliveryUseCaseRequest): Promise<EditDeliveryUseCaseResponse> {
    const delivery = await this.deliveryRepository.findById(deliveryId);

    if (!delivery) {
      return left(new ResourceNotFoundError());
    }

    if (deliveryId !== delivery.id.toString()) {
      return left(new ResourceNotFoundError());
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
