import { Recipient } from "../../enterprise/entities/recipient";

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract save(recipient: Recipient): Promise<void>;
  abstract delete(recipient: Recipient): Promise<void>;
  abstract findByEmail(email: string): Promise<Recipient | null>;
  abstract findById(reccipientId: string): Promise<Recipient | null>;
}
