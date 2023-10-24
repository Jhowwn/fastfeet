import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/Errors/not-allowed-error";
import { makeDelivery } from "test/factories/make-delivery";
import { makeDeliveryAttachment } from "test/factories/make-delivery-attachment";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryDeliveryAttachmentsRepository } from "test/repositories/in-memory-delivery-attachments-repository";
import { InMemoryDeliverysRepository } from "test/repositories/in-memory-delivery-repository";
import { EditDeliveryUseCase } from "./edit-delivery-use-case";

let inMemoryDeliverysRepository: InMemoryDeliverysRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository;
let sut: EditDeliveryUseCase;

describe("Edit Delivery", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository();
    inMemoryDeliverysRepository = new InMemoryDeliverysRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    );

    sut = new EditDeliveryUseCase(
      inMemoryDeliverysRepository,
      inMemoryDeliveryAttachmentsRepository,
    );
  });

  it("should be able to edit a delivery", async () => {
    const delivery = makeDelivery({}, new UniqueEntityID("delivery-1"));

    inMemoryDeliverysRepository.items.push(delivery);

    const result = await sut.execute({
      title: "Teste",
      description: "Teste",
      status: "Retirada",
      deliveryId: "delivery-1",
      courierId: delivery.courierId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryDeliverysRepository.items[0]).toMatchObject({
      title: "Teste",
      status: "Retirada",
    });
  });

  it("should be able to complete a delivery", async () => {
    const delivery = makeDelivery(
      { courierId: new UniqueEntityID("courier-1") },
      new UniqueEntityID("delivery-1"),
    );

    inMemoryDeliverysRepository.items.push(delivery);

    inMemoryDeliveryAttachmentsRepository.items.push(
      makeDeliveryAttachment({
        deliveryId: delivery.id,
        attachmentId: new UniqueEntityID("1"),
      }),
    );

    const result = await sut.execute({
      title: "Teste",
      description: "Teste",
      status: "Entregue",
      deliveryId: "delivery-1",
      attachmentsIds: ["1"],
      courierId: "courier-1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryDeliverysRepository.items[0]).toMatchObject({
      title: "Teste",
      status: "Entregue",
    });
    expect(
      inMemoryDeliverysRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
    ]);
  });

  it("should not be able to edit from another courier delivery", async () => {
    const delivery = makeDelivery(
      { courierId: new UniqueEntityID("courier-1") },
      new UniqueEntityID("delivery-1"),
    );

    inMemoryDeliverysRepository.items.push(delivery);

    const result = await sut.execute({
      title: "Teste",
      description: "Teste",
      status: "Devolvida",
      deliveryId: "delivery-1",
      courierId: "courier-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
