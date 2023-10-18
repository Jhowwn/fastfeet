import { UseCaseError } from "@/core/errors/use-case-error";

export class UserAlreadyRegisteredError extends Error implements UseCaseError {
  constructor() {
    super(`User already registered`);
  }
}
