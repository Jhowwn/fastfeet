import { FetchCourierDeliveriesUseCase } from "@/domain/delivery/application/use-cases/delivery/fetch-courier-deliveries-use-case";
import { Roles, UserRoles } from "@/infra/auth/roles";
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { DeliveryPresenter } from "../../presenter/delivery-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/delivery/courier/:courierId")
@Roles(UserRoles.ADMIN)
export class FetchDeliveryByCourierController {
  constructor(private fetchDelivery: FetchCourierDeliveriesUseCase) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("courierId") courierId: string,
  ) {
    const result = await this.fetchDelivery.execute({
      page,
      courierId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const delivery = result.value.deliveries;

    return { delivery: delivery.map(DeliveryPresenter.toHTTP) };
  }
}
