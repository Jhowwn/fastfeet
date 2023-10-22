import { UserRepository } from "@/domain/delivery/application/repositories/user-repository";
import { Module } from "@nestjs/common";

import { RecipientRepository } from "@/domain/delivery/application/repositories/recipient-repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipient-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientsRepository,
    },
  ],
  exports: [PrismaService, UserRepository, RecipientRepository],
})
export class DatabaseModule {}
