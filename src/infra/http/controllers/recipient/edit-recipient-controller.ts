import { EditRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/edit-recipient-use-case";
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

const editRecipientBodySchema = z.object({
  name: z.string(),
  localization: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema);

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>;

@Controller("/recipient/:id")
@Roles(UserRoles.ADMIN)
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param("id") recipientId: string,
  ) {
    const { name, localization } = body;

    const result = await this.editRecipient.execute({
      name,
      localization,
      recipientId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
