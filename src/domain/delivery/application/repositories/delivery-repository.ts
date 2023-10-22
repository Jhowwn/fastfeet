import { PaginationParams } from "@/core/repositories/pagination-params";
import { Delivery } from "../../enterprise/entities/delivery";

export abstract class DeliveryRepository {
  abstract create(delivery: Delivery): Promise<void>;
  abstract save(delivery: Delivery): Promise<void>;
  abstract delete(delivery: Delivery): Promise<void>;
  abstract findById(deliveryId: string): Promise<Delivery | null>;
  abstract findManyByRecipientId(
    recipientId: string,
    params: PaginationParams,
  ): Promise<Delivery[]>;
  abstract findManyByCourierId(
    courierId: string,
    params: PaginationParams,
  ): Promise<Delivery[]>;
}
