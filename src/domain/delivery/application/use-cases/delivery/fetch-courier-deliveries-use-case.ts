import { Either, right } from "@/core/either";
import { Delivery } from "@/domain/delivery/enterprise/entities/delivery";
import { Injectable } from "@nestjs/common";
import { DeliveryRepository } from "../../repositories/delivery-repository";

interface FetchCourierDeliveriesUseCaseRequest {
  courierId: string;
  page: number;
}

type FetchCourierDeliveriesUseCaseResponse = Either<
  null,
  {
    deliveries: Delivery[];
  }
>;

@Injectable()
export class FetchCourierDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveryRepository) {}

  async execute({
    courierId,
    page,
  }: FetchCourierDeliveriesUseCaseRequest): Promise<FetchCourierDeliveriesUseCaseResponse> {
    const deliveries = await this.deliveriesRepository.findManyByCourierId(
      courierId,
      {
        page,
      },
    );

    return right({
      deliveries,
    });
  }
}
