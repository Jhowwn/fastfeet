import { makeDelivery } from "test/factories/make-delivery";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryDeliveryAttachmentsRepository } from "test/repositories/in-memory-delivery-attachments-repository";
import { InMemoryDeliverysRepository } from "test/repositories/in-memory-delivery-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notification-repository";

import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipient-repository";
import { waitFor } from "test/utils/wait-for";
import { SpyInstance } from "vitest";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { OnChangeDeliveryStatus } from "./on-change-delivery-status";

let inMemoryDeliverysRepository: InMemoryDeliverysRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On Change Delivery Status", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository();
    inMemoryDeliverysRepository = new InMemoryDeliverysRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnChangeDeliveryStatus(
      inMemoryDeliverysRepository,
      sendNotificationUseCase,
    );
  });

  it("Should send a notification when status change", async () => {
    const recipient = makeRecipient();
    const delivery = makeDelivery({
      recipientId: recipient.id,
      status: "Aguardando",
    });

    inMemoryRecipientsRepository.create(recipient);
    inMemoryDeliverysRepository.create(delivery);

    delivery.status = "Retirada";

    inMemoryDeliverysRepository.save(delivery);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
