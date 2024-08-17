/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
export class NodeTime {
  constructor(
    public readonly communicationTimestamps: {
      sendTimestamp: string
      receiveTimestamp: string
    }
  ) {}
}
