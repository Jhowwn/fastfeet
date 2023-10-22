import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipient-repository";
import { DeleteRecipientUseCase } from "./delete-recipient-use-case";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: DeleteRecipientUseCase;

describe("Delete Recipient By Slug", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository);
  });

  it("Should be able to Delete a recipient", async () => {
    const newRecipient = makeRecipient({}, new UniqueEntityID("recipient-1"));

    await inMemoryRecipientsRepository.create(newRecipient);

    await sut.execute({
      recipientId: "recipient-1",
    });

    expect(inMemoryRecipientsRepository.items).toHaveLength(0);
  });

  it("Should not be able to Delete a recipient from another user", async () => {
    const newRecipient = makeRecipient({}, new UniqueEntityID("recipient-2"));

    await inMemoryRecipientsRepository.create(newRecipient);

    const result = await sut.execute({
      recipientId: "recipient-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
