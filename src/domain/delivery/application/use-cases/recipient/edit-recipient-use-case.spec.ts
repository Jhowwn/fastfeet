import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipient-repository";
import { EditRecipientUseCase } from "./edit-recipient-use-case";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;

let sut: EditRecipientUseCase;

describe("find Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    sut = new EditRecipientUseCase(inMemoryRecipientsRepository);
  });

  it("should be able to edit a recipient", async () => {
    const recipient = makeRecipient(
      {
        name: "Teste",
        email: "teste@example.com",
        localization: "teste",
      },
      new UniqueEntityID("recipient-1"),
    );

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      name: "Teste 2",
      localization: "teste 2",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      name: "Teste 2",
      localization: "teste 2",
    });
  });
});
