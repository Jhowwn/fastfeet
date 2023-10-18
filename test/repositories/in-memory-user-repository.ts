import { UserRepository } from "@/domain/delivery/application/repositories/user-repository";
import { User } from "@/domain/delivery/enterprise/entities/user";

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = [];
  async findByCPF(cpf: string): Promise<User | null> {
    const user = this.items.find((item) => item.cpf === cpf);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User) {
    this.items.push(user);
  }
}
