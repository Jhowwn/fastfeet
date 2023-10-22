import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipient-repository";
import { CreateRecipientUseCase } from "./create-recipient-use-case";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;

let sut: CreateRecipientUseCase;

describe("Register Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository);
  });

  it("should be able to register a new recipient", async () => {
    const result = await sut.execute({
      name: "Teste",
      email: "teste@example.com",
      localization: "Teste",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[0],
    });
    expect(inMemoryRecipientsRepository.items[0].email).toEqual(
      "teste@example.com",
    );
  });
});
