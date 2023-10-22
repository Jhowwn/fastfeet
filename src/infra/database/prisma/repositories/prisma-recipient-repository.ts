import { RecipientRepository } from "@/domain/delivery/application/repositories/recipient-repository";
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient";
import { Injectable } from "@nestjs/common";
import { PrismaRecipientMapper } from "../mapper/prisma-recipient-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaRecipientsRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async findByEmail(email: string): Promise<Recipient> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({
      data,
    });
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await Promise.all([
      this.prisma.recipient.update({
        where: {
          id: recipient.id.toString(),
        },
        data,
      }),
    ]);
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    });
  }
}
