import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository";
import { RegisterUserUseCase } from "./register-user-use-case";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

let sut: RegisterUserUseCase;

describe("Register User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to register a new user", async () => {
    const result = await sut.execute({
      name: "John Doe",
      cpf: "123456789",
      password: "123456",
      role: "ADMIN",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
    expect(inMemoryUsersRepository.items[0].role).toEqual("ADMIN");
  });

  it("should hash user password upon registration", async () => {
    const result = await sut.execute({
      name: "John Doe",
      cpf: "123456789",
      password: "123456",
      role: "DELIVERER",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
    expect(inMemoryUsersRepository.items[0].role).toEqual("DELIVERER");
  });
});
