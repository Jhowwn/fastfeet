import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";

import { RegisterUserUseCase } from "@/domain/delivery/application/use-cases/register-user-use-case";
import { StorageModule } from "../storage/storage.module";
import { CreateAccountController } from "./controllers/create-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [CreateAccountController],
  providers: [RegisterUserUseCase],
})
export class HttpModule {}
