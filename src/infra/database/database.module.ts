import { UserRepository } from "@/domain/delivery/application/repositories/user-repository";
import { Module } from "@nestjs/common";

import { DeliveryAttachmentsRepository } from "@/domain/delivery/application/repositories/delivery-attachments-repository";
import { DeliveryRepository } from "@/domain/delivery/application/repositories/delivery-repository";
import { RecipientRepository } from "@/domain/delivery/application/repositories/recipient-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaDeliveryAttachmentsRepository } from "./prisma/repositories/prisma-delivery-attachments-repository";
import { PrismaDeliverysRepository } from "./prisma/repositories/prisma-delivery-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
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
    {
      provide: DeliveryRepository,
      useClass: PrismaDeliverysRepository,
    },
    {
      provide: DeliveryAttachmentsRepository,
      useClass: PrismaDeliveryAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    RecipientRepository,
    DeliveryRepository,
    DeliveryAttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
