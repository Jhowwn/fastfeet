import { DeleteDeliveryUseCase } from "@/domain/delivery/application/use-cases/delivery/delete-delivery-use-case";
import { Roles, UserRoles } from "@/infra/auth/roles";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";

@Controller("/delivery/:id")
@Roles(UserRoles.ADMIN)
export class DeleteDeliveryController {
  constructor(private deleteDelivery: DeleteDeliveryUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") deliveryId: string) {
    const result = await this.deleteDelivery.execute({
      deliveryId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
