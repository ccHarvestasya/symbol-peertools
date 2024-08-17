/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
export class FinalizationStatistics {
  constructor(
    public readonly epoch: number,
    public readonly point: number,
    public readonly height: string,
    public readonly hash: string
  ) {}
}
