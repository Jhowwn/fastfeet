import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/Errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { Injectable } from "@nestjs/common";
import { Delivery } from "../../../enterprise/entities/delivery";
import { DeliveryRepository } from "../../repositories/delivery-repository";

interface DeleteDeliveryUseCaseRequest {
  deliveryId: string;
}

type DeleteDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    delivery: Delivery;
  }
>;

@Injectable()
export class DeleteDeliveryUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  async execute({
    deliveryId,
  }: DeleteDeliveryUseCaseRequest): Promise<DeleteDeliveryUseCaseResponse> {
    const delivery = await this.deliveryRepository.findById(deliveryId);

    if (!delivery) {
      return left(new ResourceNotFoundError());
    }

    if (deliveryId !== delivery.id.toString()) {
      return left(new ResourceNotFoundError());
    }

    await this.deliveryRepository.delete(delivery);

    return right({
      delivery,
    });
  }
}
