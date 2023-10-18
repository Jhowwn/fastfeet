import { User } from "../../enterprise/entities/user";

export abstract class UserRepository {
  abstract findByCPF(cpf: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
}
