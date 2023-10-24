import { EditDeliveryUseCase } from "@/domain/delivery/application/use-cases/delivery/edit-delivery-use-case";
import { Roles, UserRoles } from "@/infra/auth/roles";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const editDeliveryBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  courierId: z.string(),
  status: z.enum(["Aguardando", "Retirada", "Entregue", "Devolvida"]),
  attachments: z.array(z.string().uuid()).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(editDeliveryBodySchema);

type EditDeliveryBodySchema = z.infer<typeof editDeliveryBodySchema>;

@Controller("/delivery/:id")
@Roles(UserRoles.ADMIN)
export class EditDeliveryController {
  constructor(private editDelivery: EditDeliveryUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryBodySchema,
    @Param("id") deliveryId: string,
  ) {
    const { title, description, status, courierId, attachments } = body;

    if (status === "Entregue" && (!attachments || attachments.length === 0)) {
      throw new BadRequestException("To conclude a delivery send a picture");
    }

    const result = await this.editDelivery.execute({
      title,
      description,
      status,
      deliveryId,
      courierId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
