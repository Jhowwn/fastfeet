import { FindRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/find-recipient-by-email-use-case";
import { Roles, UserRoles } from "@/infra/auth/roles";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { RecipientPresenter } from "../../presenter/recipient-presenter";

@Controller("/recipient/:email")
@Roles(UserRoles.ADMIN)
export class FindRecipientController {
  constructor(private findRecipient: FindRecipientUseCase) {}

  @Get()
  async handle(@Param("email") email: string) {
    const result = await this.findRecipient.execute({
      email,
    });

    if (result.isLeft()) {
      const error = result.value;
      throw new BadRequestException(error.message);
    }

    const recipient = result.value.recipient;

    return { recipient: RecipientPresenter.toHTTP(recipient) };
  }
}
