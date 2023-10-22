import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Find recipient by email (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /recipient", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });
    await recipientFactory.makePrismaRecipient({
      email: "jhondoe@email.com",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get("/recipient/jhondoe@email.com")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        email: "jhondoe@email.com",
      },
    });

    expect(recipientOnDatabase).toBeTruthy();
    expect(recipientOnDatabase.email).toEqual("jhondoe@email.com");
  });
});
