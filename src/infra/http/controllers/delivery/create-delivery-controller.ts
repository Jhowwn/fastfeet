import { CreateDeliveryUseCase } from "@/domain/delivery/application/use-cases/delivery/create-delivery-use-case";
import { Roles, UserRoles } from "@/infra/auth/roles";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const createDeliveryBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  recipientId: z.string(),
  courierId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  status: z.enum(["Aguardando", "Retirada", "Entregue", "Devolvida"]),
});

type CreateDeliveryBodySchema = z.infer<typeof createDeliveryBodySchema>;

@Controller("/delivery")
@Roles(UserRoles.ADMIN)
export class CreateDeliveryController {
  constructor(private createDelivery: CreateDeliveryUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliveryBodySchema))
  async handle(@Body() body: CreateDeliveryBodySchema) {
    const {
      title,
      description,
      recipientId,
      courierId,
      latitude,
      longitude,
      status,
    } = body;

    const result = await this.createDelivery.execute({
      title,
      description,
      recipientId,
      courierId,
      latitude,
      longitude,
      status,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
