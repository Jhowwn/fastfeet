import { RecipientRepository } from "@/domain/delivery/application/repositories/recipient-repository";
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient";

export class InMemoryRecipientsRepository implements RecipientRepository {
  public items: Recipient[] = [];

  async create(delivery: Recipient) {
    this.items.push(delivery);
  }

  async findByEmail(email: string) {
    const recipient = this.items.find((item) => item.email === email);

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async findById(recipientId: string) {
    const recipient = this.items.find(
      (item) => item.id.toString() === recipientId,
    );

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === recipient.id.toString(),
    );

    this.items[itemIndex] = recipient;
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === recipient.id.toString(),
    );

    this.items.splice(itemIndex, 1);
  }
}
