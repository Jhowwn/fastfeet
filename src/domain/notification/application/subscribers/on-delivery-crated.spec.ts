import { makeDelivery } from "test/factories/make-delivery";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryDeliveryAttachmentsRepository } from "test/repositories/in-memory-delivery-attachments-repository";
import { InMemoryDeliverysRepository } from "test/repositories/in-memory-delivery-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipient-repository";

import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notification-repository";
import { waitFor } from "test/utils/wait-for";
import { SpyInstance } from "vitest";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { OnDeliveryCreated } from "./on-delivery-created";

let inMemoryDeliverysRepository: InMemoryDeliverysRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On Delivery Created", () => {
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

    new OnDeliveryCreated(inMemoryDeliverysRepository, sendNotificationUseCase);
  });

  it("Should send a notification when an delivery is created", async () => {
    const recipient = makeRecipient();
    const delivery = makeDelivery({
      recipientId: recipient.id,
      status: "Aguardando",
    });

    inMemoryRecipientsRepository.create(recipient);
    inMemoryDeliverysRepository.create(delivery);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
