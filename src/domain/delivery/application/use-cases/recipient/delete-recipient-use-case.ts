import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/Errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { Injectable } from "@nestjs/common";
import { RecipientRepository } from "../../repositories/recipient-repository";

interface DeleteRecipientUseCaseRequest {
  recipientId: string;
}

type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    await this.recipientRepository.delete(recipient);

    return right(null);
  }
}
