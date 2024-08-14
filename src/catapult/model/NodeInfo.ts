export class NodeInfo {
  constructor(
    public readonly version: number,
    public readonly publicKey: string,
    public readonly networkGenerationHashSeed: string,
    public readonly roles: number,
    public readonly port: number,
    public readonly networkIdentifier: number,
    public readonly host: string,
    public readonly friendlyName: string,
    public readonly nodePublicKey: string,
    public readonly certificateExpirationDate?: Date
  ) {}
}
