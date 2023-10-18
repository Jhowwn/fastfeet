export abstract class Encrypter {
  abstract encrypt(playload: Record<string, unknown>): Promise<string>;
}
