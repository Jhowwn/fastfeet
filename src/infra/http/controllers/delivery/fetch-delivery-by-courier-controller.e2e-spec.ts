import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DeliveryFactory } from "test/factories/make-delivery";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Fetch deliveries for courier (E2E)", () => {
  let app: INestApplication;
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

    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    deliveryFactory = moduleRef.get(DeliveryFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /delivery", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });
    const courier = await userFactory.makePrismaUser({ role: "DELIVERER" });
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const recipientId = recipient.id;
    const courierId = courier.id;

    await Promise.all([
      deliveryFactory.makePrismaDelivery({
        title: "Delivery 1",
        recipientId: recipientId,
        courierId: courierId,
      }),
      deliveryFactory.makePrismaDelivery({
        title: "Delivery 2",
        recipientId: recipientId,
        courierId: courierId,
      }),
      deliveryFactory.makePrismaDelivery({
        title: "Delivery 3",
        recipientId: recipientId,
        courierId: courierId,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/delivery/courier/${courierId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      delivery: expect.arrayContaining([
        expect.objectContaining({ title: "Delivery 1" }),
        expect.objectContaining({ title: "Delivery 2" }),
        expect.objectContaining({ title: "Delivery 3" }),
      ]),
    });
  });
});
