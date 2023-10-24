import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DeliveryFactory } from "test/factories/make-delivery";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Delete delivery (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let deliveryFactory: DeliveryFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, DeliveryFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    deliveryFactory = moduleRef.get(DeliveryFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[DELETE] /delivery/:id", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });
    const courier = await userFactory.makePrismaUser({ role: "DELIVERER" });
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const recipientId = recipient.id;
    const courierId = courier.id;

    const delivery = await deliveryFactory.makePrismaDelivery({
      recipientId: recipientId,
      courierId: courierId,
    });

    const deliveryId = delivery.id;

    const response = await request(app.getHttpServer())
      .delete(`/delivery/${deliveryId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const recipientOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id.toString(),
      },
    });

    expect(recipientOnDatabase).toBeNull();
  });
});
