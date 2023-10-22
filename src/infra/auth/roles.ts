import { SetMetadata } from "@nestjs/common";

export enum UserRoles {
  ADMIN = "ADMIN",
  DELIVERER = "DELIVERER",
}

export const Roles = (...roles: UserRoles[]) => SetMetadata("roles", roles);
