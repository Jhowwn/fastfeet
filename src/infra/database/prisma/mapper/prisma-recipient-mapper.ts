import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient";
import { Prisma, Recipient as PrismaRecipient } from "@prisma/client";

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        localization: raw.localization,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      localization: recipient.localization,
    };
  }
}
