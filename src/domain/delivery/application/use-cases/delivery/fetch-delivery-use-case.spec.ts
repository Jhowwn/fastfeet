import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeDelivery } from "test/factories/make-delivery";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryDeliverysRepository } from "test/repositories/in-memory-delivery-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipient-repository";
import { FetchDeliveriesUseCase } from "./fetch-delivery-use-case";

let inMemoryRecipientRepository: InMemoryRecipientsRepository;
let inMemoryDeliveryRepository: InMemoryDeliverysRepository;
let sut: FetchDeliveriesUseCase;

describe("Fetch Delivery Comments", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientsRepository();
    inMemoryDeliveryRepository = new InMemoryDeliverysRepository();
    sut = new FetchDeliveriesUseCase(inMemoryDeliveryRepository);
  });

  it("should be able to fetch delivery", async () => {
    const recipient = makeRecipient({}, new UniqueEntityID("recipient-1"));

    inMemoryRecipientRepository.items.push(recipient);

    const delivery1 = makeDelivery({
      title: "Delivery 1",
      courierId: new UniqueEntityID("courier-1"),
      recipientId: recipient.id,
    });

    const delivery2 = makeDelivery({
      title: "Delivery 2",
      courierId: new UniqueEntityID("courier-2"),
      recipientId: recipient.id,
    });

    const delivery3 = makeDelivery({
      title: "Delivery 3",
      courierId: new UniqueEntityID("courier-3"),
      recipientId: recipient.id,
    });

    await inMemoryDeliveryRepository.create(delivery1);
    await inMemoryDeliveryRepository.create(delivery2);
    await inMemoryDeliveryRepository.create(delivery3);

    const result = await sut.execute({
      recipientId: "recipient-1",
      page: 1,
    });

    expect(result.value?.deliveries).toHaveLength(3);
    expect(result.value?.deliveries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Delivery 1",
          _id: delivery1.id,
        }),
        expect.objectContaining({
          title: "Delivery 2",
          _id: delivery2.id,
        }),
        expect.objectContaining({
          title: "Delivery 3",
          _id: delivery3.id,
        }),
      ]),
    );
  });

  it("should be able to fetch paginated delivery", async () => {
    const recipient = makeRecipient({}, new UniqueEntityID("delivery-1"));

    inMemoryRecipientRepository.items.push(recipient);

    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryRepository.create(
        makeDelivery({
          title: `delivery ${i}`,
          recipientId: recipient.id,
        }),
      );
    }

    const result = await sut.execute({
      recipientId: "delivery-1",
      page: 2,
    });

    expect(result.value?.deliveries).toHaveLength(2);
  });
});
