import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Create delivery (E2E)", () => {
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

  test("[POST] /delivery", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });
    const courier = await userFactory.makePrismaUser({ role: "DELIVERER" });

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const recipient = await recipientFactory.makePrismaRecipient({
      email: "jhondoe@email.com",
    });

    const recipientId = recipient.id.toString();
    const courierId = courier.id.toString();

    const response = await request(app.getHttpServer())
      .post("/delivery")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Delivery",
        description: "Delivery delivery",
        recipientId,
        courierId,
        latitude: 123,
        longitude: 123,
        status: "Aguardando",
      });

    expect(response.statusCode).toBe(201);

    const deliveryOnDatabase = await prisma.delivery.findFirst({
      where: {
        title: "Delivery",
      },
    });

    expect(deliveryOnDatabase).toBeTruthy();
    expect(deliveryOnDatabase.status).toEqual("Aguardando");
  });
});
