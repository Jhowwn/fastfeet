import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Create recipient (E2E)", () => {
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

  test("[POST] /recipient", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/recipient")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "John Doe 1",
        email: "jhondoe@email.com",
        localization: "English",
      });

    expect(response.statusCode).toBe(201);

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        email: "jhondoe@email.com",
      },
    });

    expect(recipientOnDatabase).toBeTruthy();
    expect(recipientOnDatabase.name).toEqual("John Doe 1");
  });
});
