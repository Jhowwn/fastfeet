import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeDelivery } from "test/factories/make-delivery";
import { makeUser } from "test/factories/make-user";
import { InMemoryDeliverysRepository } from "test/repositories/in-memory-delivery-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository";
import { FetchCourierDeliveriesUseCase } from "./fetch-courier-deliveries-use-case";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryDeliveryRepository: InMemoryDeliverysRepository;
let sut: FetchCourierDeliveriesUseCase;

describe("Fetch Delivery Comments", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryDeliveryRepository = new InMemoryDeliverysRepository();
    sut = new FetchCourierDeliveriesUseCase(inMemoryDeliveryRepository);
  });

  it("should be able to fetch delivery", async () => {
    const courier = makeUser(
      { role: "DELIVERER" },
      new UniqueEntityID("courier-1"),
    );

    inMemoryUserRepository.items.push(courier);

    const courier1 = makeDelivery({
      title: "Delivery 1",
      recipientId: new UniqueEntityID("courier-1"),
      courierId: courier.id,
    });

    const courier2 = makeDelivery({
      title: "Delivery 2",
      recipientId: new UniqueEntityID("courier-1"),
      courierId: courier.id,
    });

    const courier3 = makeDelivery({
      title: "Delivery 3",
      recipientId: new UniqueEntityID("courier-1"),
      courierId: courier.id,
    });

    await inMemoryDeliveryRepository.create(courier1);
    await inMemoryDeliveryRepository.create(courier2);
    await inMemoryDeliveryRepository.create(courier3);

    const result = await sut.execute({
      courierId: "courier-1",
      page: 1,
    });

    expect(result.value?.deliveries).toHaveLength(3);
    expect(result.value?.deliveries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Delivery 1",
          courierId: courier1.courierId,
        }),
        expect.objectContaining({
          title: "Delivery 2",
          courierId: courier2.courierId,
        }),
        expect.objectContaining({
          title: "Delivery 3",
          courierId: courier3.courierId,
        }),
      ]),
    );
  });

  it("should be able to fetch paginated delivery", async () => {
    const user = makeUser(
      { role: "DELIVERER" },
      new UniqueEntityID("courier-1"),
    );

    inMemoryUserRepository.items.push(user);

    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryRepository.create(
        makeDelivery({
          title: `courier ${i}`,
          courierId: user.id,
        }),
      );
    }

    const result = await sut.execute({
      courierId: "courier-1",
      page: 2,
    });

    expect(result.value?.deliveries).toHaveLength(2);
  });
});
