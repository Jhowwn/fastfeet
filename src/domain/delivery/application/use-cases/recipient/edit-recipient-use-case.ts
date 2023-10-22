import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/Errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../../enterprise/entities/recipient";
import { RecipientRepository } from "../../repositories/recipient-repository";

interface EditRecipientUseCaseRequest {
  recipientId: string;
  name: string;
  localization: string;
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
    name,
    localization,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== recipient.id.toString()) {
      return left(new ResourceNotFoundError());
    }

    recipient.name = name;
    recipient.localization = localization;

    await this.recipientRepository.save(recipient);

    return right({
      recipient,
    });
  }
}
