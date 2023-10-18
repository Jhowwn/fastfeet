import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  [x: string]: any;
  constructor() {
    super({
      log: ["warn", "error"],
    });
  }

  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}
