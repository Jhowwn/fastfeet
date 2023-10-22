import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { makeDelivery } from "test/factories/make-delivery";
import { InMemoryDeliverysRepository } from "test/repositories/in-memory-delivery-repository";
import { DeleteDeliveryUseCase } from "./delete-delivery-use-case";

let inMemoryDeliverysRepository: InMemoryDeliverysRepository;
let sut: DeleteDeliveryUseCase;

describe("Delete Delivery", () => {
  beforeEach(() => {
    inMemoryDeliverysRepository = new InMemoryDeliverysRepository();

    sut = new DeleteDeliveryUseCase(inMemoryDeliverysRepository);
  });

  it("should be able to delete a delivery", async () => {
    const delivery = makeDelivery({}, new UniqueEntityID("delivery-1"));

    inMemoryDeliverysRepository.items.push(delivery);

    await sut.execute({
      deliveryId: "delivery-1",
    });

    expect(inMemoryDeliverysRepository.items).toHaveLength(0);
  });

  it("Should not be able to Delete a recipient from another user", async () => {
    const newRecipient = makeDelivery({}, new UniqueEntityID("delivery-2"));

    await inMemoryDeliverysRepository.create(newRecipient);

    const result = await sut.execute({
      deliveryId: "delivery-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
