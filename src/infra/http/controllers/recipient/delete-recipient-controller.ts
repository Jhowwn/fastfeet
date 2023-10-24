import { DeleteRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/delete-recipient-use-case";
import { Roles, UserRoles } from "@/infra/auth/roles";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";

@Controller("/recipient/:id")
@Roles(UserRoles.ADMIN)
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") recipientId: string) {
    const result = await this.deleteRecipient.execute({
      recipientId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
