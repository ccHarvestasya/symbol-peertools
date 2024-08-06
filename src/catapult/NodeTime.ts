export class NodeTime {
  /**
   * コンストラクタ
   * @param communicationTimestamps 通信タイムスタンプ
   */
  constructor(
    /**
     * 通信タイムスタンプ
     */
    public readonly communicationTimestamps: {
      /**
       * 送信時間
       */
      sendTimestamp: string
      /**
       * 受信時間
       */
      receiveTimestamp: string
    }
  ) {}
}
