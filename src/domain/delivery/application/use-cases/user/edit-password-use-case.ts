import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { User } from "../../../enterprise/entities/user";
import { HashGenerator } from "../../cryptography/hash-generator";
import { UserAlreadyRegisteredError } from "../../errors/User-Already-Registered-Error";
import { WrongCredentialsError } from "../../errors/wrong-credentials-error";
import { UserRepository } from "../../repositories/user-repository";

interface EditPasswordUseCaseRequest {
  userId: string;
  password: string;
}

type EditPasswordUseCaseResponse = Either<
  UserAlreadyRegisteredError,
  {
    user: User;
  }
>;

@Injectable()
export class EditPasswordUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    password,
  }: EditPasswordUseCaseRequest): Promise<EditPasswordUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    if (user.password === hashedPassword) {
      return left(new Error("Password already in use"));
    }

    user.password = hashedPassword;

    await this.userRepository.save(user);

    return right({
      user,
    });
  }
}
