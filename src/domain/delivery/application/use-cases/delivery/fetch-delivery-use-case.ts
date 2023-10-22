import { Either, right } from "@/core/either";
import { Delivery } from "@/domain/delivery/enterprise/entities/delivery";
import { Injectable } from "@nestjs/common";
import { DeliveryRepository } from "../../repositories/delivery-repository";

interface FetchDeliveriesUseCaseRequest {
  recipientId: string;
  page: number;
}

type FetchDeliveriesUseCaseResponse = Either<
  null,
  {
    deliveries: Delivery[];
  }
>;

@Injectable()
export class FetchDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveryRepository) {}

  async execute({
    recipientId,
    page,
  }: FetchDeliveriesUseCaseRequest): Promise<FetchDeliveriesUseCaseResponse> {
    const deliveries = await this.deliveriesRepository.findManyByRecipientId(
      recipientId,
      {
        page,
      },
    );

    return right({
      deliveries,
    });
  }
}
