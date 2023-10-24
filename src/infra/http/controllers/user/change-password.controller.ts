import { EditPasswordUserUseCase } from "@/domain/delivery/application/use-cases/user/edit-password-use-case";
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

const editPasswordBodySchema = z.object({
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editPasswordBodySchema);

type EditPasswordBodySchema = z.infer<typeof editPasswordBodySchema>;

@Controller("/password/:id")
@Roles(UserRoles.ADMIN)
export class EditPasswordController {
  constructor(private editPassword: EditPasswordUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditPasswordBodySchema,
    @Param("id") userId: string,
  ) {
    const { password } = body;
    console.log(password, userId);

    const result = await this.editPassword.execute({
      password,
      userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
