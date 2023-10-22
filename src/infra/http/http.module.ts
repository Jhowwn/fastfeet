import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";

import { CreateRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/create-recipient-use-case";
import { FindRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/find-recipient-by-email-use-case";
import { AuthenticateUserUseCase } from "@/domain/delivery/application/use-cases/user/authenticate-use-case";
import { RegisterUserUseCase } from "@/domain/delivery/application/use-cases/user/register-user-use-case";
import { StorageModule } from "../storage/storage.module";
import { CreateRecipientController } from "./controllers/recipient/create-recipient-controller";
import { FindRecipientController } from "./controllers/recipient/find-recipient-by-email-controler";
import { AuthenticateController } from "./controllers/user/authenticate.controller";
import { CreateAccountController } from "./controllers/user/create-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateRecipientController,
    FindRecipientController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreateRecipientUseCase,
    FindRecipientUseCase,
  ],
})
export class HttpModule {}
