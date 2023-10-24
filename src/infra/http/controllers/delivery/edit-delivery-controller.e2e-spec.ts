import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachments";
import { DeliveryFactory } from "test/factories/make-delivery";
import { DeliveryAttachmentFactory } from "test/factories/make-delivery-attachment";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Edit delivery (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let deliveryFactory: DeliveryFactory;
  let deliveryAttachmentFactory: DeliveryAttachmentFactory;
  let attachmentFactory: AttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        RecipientFactory,
        DeliveryFactory,
        AttachmentFactory,
        DeliveryAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    deliveryFactory = moduleRef.get(DeliveryFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    deliveryAttachmentFactory = moduleRef.get(DeliveryAttachmentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /delivery/:id", async () => {
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

    const attachment1 = await attachmentFactory.makePrismaAttachment();

    const deliveryAttachment =
      await deliveryAttachmentFactory.makePrismaDeliveryAttachment({
        deliveryId: delivery.id,
        attachmentId: attachment1.id,
      });

    const deliveryId = delivery.id;

    const response = await request(app.getHttpServer())
      .put(`/delivery/${deliveryId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Delivery",
        description: "Delivery delivery",
        status: "Entregue",
        courierId: courierId.toString(),
        attachments: [deliveryAttachment.attachmentId.toString()],
      });

    console.log(response.body);
    expect(response.statusCode).toBe(204);

    const recipientOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id.toString(),
      },
    });

    expect(recipientOnDatabase).toBeTruthy();
    expect(recipientOnDatabase.title).toEqual("Delivery");
    expect(recipientOnDatabase.status).toEqual("Entregue");
  });

  test("[PUT] status Retirado /delivery/:id", async () => {
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
      .put(`/delivery/${deliveryId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Delivery",
        description: "Delivery delivery",
        status: "Retirada",
        courierId: courierId.toString(),
        attachments: [],
      });

    console.log(response.body);
    expect(response.statusCode).toBe(204);

    const recipientOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id.toString(),
      },
    });

    expect(recipientOnDatabase).toBeTruthy();
    expect(recipientOnDatabase.title).toEqual("Delivery");
    expect(recipientOnDatabase.status).toEqual("Retirada");
  });
});
