import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@prisma/client/runtime/library";

type UserRole = "ADMIN" | "DELIVERER";

export interface UserProps {
  name: string;
  cpf: string;
  password: string;
  role: UserRole;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;
  }

  static create(props: Optional<UserProps, "role">, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        role: props.role,
      },
      id,
    );

    console.log(user);

    return user;
  }
}
