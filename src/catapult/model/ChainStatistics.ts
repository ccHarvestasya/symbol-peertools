export class ChainStatistics {
  constructor(
    public readonly height: string,
    public readonly finalizedHeight: string,
    public readonly scoreHigh: string,
    public readonly scoreLow: string
  ) {}
}
