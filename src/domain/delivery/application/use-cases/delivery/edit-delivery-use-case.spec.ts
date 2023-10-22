import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeDelivery } from "test/factories/make-delivery";
import { InMemoryDeliverysRepository } from "test/repositories/in-memory-delivery-repository";
import { EditDeliveryUseCase } from "./edit-delivery-use-case";

let inMemoryDeliverysRepository: InMemoryDeliverysRepository;
let sut: EditDeliveryUseCase;

describe("Edit Delivery", () => {
  beforeEach(() => {
    inMemoryDeliverysRepository = new InMemoryDeliverysRepository();

    sut = new EditDeliveryUseCase(inMemoryDeliverysRepository);
  });

  it("should be able to edit a delivery", async () => {
    const delivery = makeDelivery({}, new UniqueEntityID("delivery-1"));

    inMemoryDeliverysRepository.items.push(delivery);

    const result = await sut.execute({
      title: "Teste",
      description: "Teste",
      status: "Entregue",
      deliveryId: "delivery-1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryDeliverysRepository.items[0]).toMatchObject({
      title: "Teste",
      status: "Entregue",
    });
  });
});
