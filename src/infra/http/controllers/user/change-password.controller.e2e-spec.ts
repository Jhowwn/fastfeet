import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Edit userpassword (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /userpassword", async () => {
    const user = await userFactory.makePrismaUser({
      role: "ADMIN",
    });
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const userId = user.id;

    const response = await request(app.getHttpServer())
      .put(`/password/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userId: userId,
        password: "12345678",
      });

    expect(response.statusCode).toBe(204);

    const userpasswordOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    });

    expect(userpasswordOnDatabase).toBeTruthy();
  });
});
