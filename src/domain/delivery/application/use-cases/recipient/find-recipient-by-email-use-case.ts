import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/Errors/resource-not-found";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../../enterprise/entities/recipient";
import { RecipientRepository } from "../../repositories/recipient-repository";

interface FindRecipientUseCaseRequest {
  email: string;
}

type FindRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class FindRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    email,
  }: FindRecipientUseCaseRequest): Promise<FindRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findByEmail(email);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    return right({
      recipient,
    });
  }
}
