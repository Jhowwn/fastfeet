import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserRepository } from "../repositories/user-repository";
import { UserAlreadyRegisteredError } from "./error/User-Already-Registered-Error";

type UserRole = "ADMIN" | "DELIVERER";

interface RegisterUserUseCaseRequest {
  cpf: string;
  name: string;
  password: string;
  role: UserRole;
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyRegisteredError,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByCPF(cpf);

    if (userAlreadyExists) {
      return left(new UserAlreadyRegisteredError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
      role,
    });

    await this.userRepository.create(user);

    return right({
      user,
    });
  }
}
