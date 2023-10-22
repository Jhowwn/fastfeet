import { UserAlreadyRegisteredError } from "@/domain/delivery/application/errors/User-Already-Registered-Error";
import { CreateRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/create-recipient-use-case";
import { Roles, UserRoles } from "@/infra/auth/roles";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const createRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  localization: z.string(),
});

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller("/recipient")
@Roles(UserRoles.ADMIN)
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const { name, email, localization } = body;

    const result = await this.createRecipient.execute({
      name,
      email,
      localization,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyRegisteredError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
