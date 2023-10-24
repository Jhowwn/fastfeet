import { OnChangeDeliveryStatus } from "@/domain/notification/application/subscribers/on-change-delivery-status";
import { OnDeliveryCreated } from "@/domain/notification/application/subscribers/on-delivery-created";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [
    OnDeliveryCreated,
    OnChangeDeliveryStatus,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
