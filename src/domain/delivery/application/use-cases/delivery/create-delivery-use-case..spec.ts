import { InMemoryDeliverysRepository } from "test/repositories/in-memory-delivery-repository";
import { CreateDeliveryUseCase } from "./create-delivery-use-case";

let inMemoryDeliverysRepository: InMemoryDeliverysRepository;

let sut: CreateDeliveryUseCase;

describe("Register Delivery", () => {
  beforeEach(() => {
    inMemoryDeliverysRepository = new InMemoryDeliverysRepository();

    sut = new CreateDeliveryUseCase(inMemoryDeliverysRepository);
  });

  it("should be able to register a new delivery", async () => {
    const result = await sut.execute({
      title: "Teste",
      description: "Teste",
      status: "Aguardando",
      longitude: 123,
      latitude: 123,
      courierId: "1",
      recipientId: "1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      delivery: inMemoryDeliverysRepository.items[0],
    });
    // expect(inMemoryDeliverysRepository.items[0].role).toEqual("ADMIN");
  });
});
