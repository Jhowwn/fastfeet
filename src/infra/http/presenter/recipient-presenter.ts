import { Recipient } from "@/domain/delivery/enterprise/entities/recipient";

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      email: recipient.email,
      name: recipient.name,
      localization: recipient.localization,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    };
  }
}
