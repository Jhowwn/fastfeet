import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";

import { CreateDeliveryUseCase } from "@/domain/delivery/application/use-cases/delivery/create-delivery-use-case";
import { DeleteDeliveryUseCase } from "@/domain/delivery/application/use-cases/delivery/delete-delivery-use-case";
import { EditDeliveryUseCase } from "@/domain/delivery/application/use-cases/delivery/edit-delivery-use-case";
import { FetchCourierDeliveriesUseCase } from "@/domain/delivery/application/use-cases/delivery/fetch-courier-deliveries-use-case";
import { FetchDeliveriesUseCase } from "@/domain/delivery/application/use-cases/delivery/fetch-delivery-use-case";
import { CreateRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/create-recipient-use-case";
import { DeleteRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/delete-recipient-use-case";
import { EditRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/edit-recipient-use-case";
import { FindRecipientUseCase } from "@/domain/delivery/application/use-cases/recipient/find-recipient-by-email-use-case";
import { AuthenticateUserUseCase } from "@/domain/delivery/application/use-cases/user/authenticate-use-case";
import { EditPasswordUserUseCase } from "@/domain/delivery/application/use-cases/user/edit-password-use-case";
import { RegisterUserUseCase } from "@/domain/delivery/application/use-cases/user/register-user-use-case";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { StorageModule } from "../storage/storage.module";
import { CreateDeliveryController } from "./controllers/delivery/create-delivery-controller";
import { DeleteDeliveryController } from "./controllers/delivery/delete-delivery-controller";
import { EditDeliveryController } from "./controllers/delivery/edit-delivery-controller";
import { FetchDeliveryByCourierController } from "./controllers/delivery/fetch-delivery-by-courier-controller";
import { FetchDeliveryController } from "./controllers/delivery/fetch-delivery-by-recipient-controller";
import { ReadNotificationController } from "./controllers/notifications/read-notification.controller";
import { CreateRecipientController } from "./controllers/recipient/create-recipient-controller";
import { DeleteRecipientController } from "./controllers/recipient/delete-recipient-controller";
import { EditRecipientController } from "./controllers/recipient/edit-recipient-controller";
import { FindRecipientController } from "./controllers/recipient/find-recipient-by-email-controler";
import { AuthenticateController } from "./controllers/user/authenticate.controller";
import { EditPasswordController } from "./controllers/user/change-password.controller";
import { CreateAccountController } from "./controllers/user/create-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    EditPasswordController,
    CreateRecipientController,
    FindRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    CreateDeliveryController,
    EditDeliveryController,
    DeleteDeliveryController,
    FetchDeliveryController,
    FetchDeliveryByCourierController,
    ReadNotificationController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    EditPasswordUserUseCase,
    CreateRecipientUseCase,
    FindRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    CreateDeliveryUseCase,
    EditDeliveryUseCase,
    DeleteDeliveryUseCase,
    FetchDeliveriesUseCase,
    FetchCourierDeliveriesUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
