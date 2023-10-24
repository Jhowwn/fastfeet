import { DomainEvents } from "@/core/events/domain-events";
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
import { waitFor } from "test/utils/wait-for";

describe("On recipient best delivery chosen (E2E)", () => {
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

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it("should send a notification when delivery change status", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const delivery = await deliveryFactory.makePrismaDelivery({
      recipientId: recipient.id,
    });

    const deliveryId = delivery.id.toString();

    await request(app.getHttpServer())
      .patch(`/deliverys/${deliveryId}/change-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
