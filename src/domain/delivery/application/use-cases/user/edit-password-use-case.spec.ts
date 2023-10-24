import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository";
import { EditPasswordUserUseCase } from "./edit-password-use-case";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

let sut: EditPasswordUserUseCase;

describe("Edit User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    sut = new EditPasswordUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to edit an user", async () => {
    const user = makeUser({ cpf: "123456789", password: "123456789" });

    const password = "123456";

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      password: password,
    });

    expect(result.isRight()).toBe(true);

    const hashedPassword = await fakeHasher.hash(password);

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });
});
