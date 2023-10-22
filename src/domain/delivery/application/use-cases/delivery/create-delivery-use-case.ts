import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { Delivery } from "../../../enterprise/entities/delivery";
import { DeliveryRepository } from "../../repositories/delivery-repository";

type DeliveryStatus = "Aguardando" | "Retirada" | "Entregue" | "Devolvida";

interface CreateDeliveryUseCaseRequest {
  title: string;
  description: string;
  recipientId: string;
  courierId: string;
  latitude: number;
  longitude: number;
  status: DeliveryStatus;
}

type CreateDeliveryUseCaseResponse = Either<
  null,
  {
    delivery: Delivery;
  }
>;

@Injectable()
export class CreateDeliveryUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  async execute({
    title,
    description,
    longitude,
    latitude,
    status,
    courierId,
    recipientId,
  }: CreateDeliveryUseCaseRequest): Promise<CreateDeliveryUseCaseResponse> {
    const delivery = Delivery.create({
      title,
      description,
      status,
      longitude,
      latitude,
      courierId: new UniqueEntityID(courierId),
      recipientId: new UniqueEntityID(recipientId),
    });

    await this.deliveryRepository.create(delivery);

    return right({
      delivery,
    });
  }
}
