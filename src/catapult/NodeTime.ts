export class NodeTime {
  constructor(
    public readonly communicationTimestamps: {
      sendTimestamp: string
      receiveTimestamp: string
    }
  ) {}
}
