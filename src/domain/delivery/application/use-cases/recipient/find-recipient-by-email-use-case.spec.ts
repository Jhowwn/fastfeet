import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipient-repository";
import { FindRecipientUseCase } from "./find-recipient-by-email-use-case";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;

let sut: FindRecipientUseCase;

describe("find Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    sut = new FindRecipientUseCase(inMemoryRecipientsRepository);
  });

  it("should be able to find a recipient", async () => {
    const recipient = makeRecipient({
      email: "teste@example.com",
    });

    inMemoryRecipientsRepository.items.push(recipient);

    const result = await sut.execute({
      email: "teste@example.com",
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
