import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../../enterprise/entities/recipient";
import { UserAlreadyRegisteredError } from "../../errors/User-Already-Registered-Error";
import { RecipientRepository } from "../../repositories/recipient-repository";

interface CreateRecipientUseCaseRequest {
  name: string;
  email: string;
  localization: string;
}

type CreateRecipientUseCaseResponse = Either<
  UserAlreadyRegisteredError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    email,
    localization,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
      email,
      localization,
    });

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
