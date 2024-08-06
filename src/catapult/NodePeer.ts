/**
 * NodePeer
 */
export class NodePeer {
  /**
   * コンストラクタ
   * @param version バージョン
   * @param publicKey 公開鍵
   * @param networkGenerationHashSeed ネットワークジェネレーションハッシュシード
   * @param roles ロール
   * @param port ポート
   * @param networkIdentifier ネットワーク識別子
   * @param host ホスト
   * @param friendlyName フレンドリーネーム
   */
  constructor(
    /**
     * バージョン
     */
    public readonly version: number,

    /**
     * 公開鍵
     */
    public readonly publicKey: string,

    /**
     * ネットワークジェネレーションハッシュ
     */
    public readonly networkGenerationHashSeed: string,

    /**
     * ロール
     */
    public readonly roles: number,

    /**
     * ポート
     */
    public readonly port: number,

    /**
     * ネットワークID
     */
    public readonly networkIdentifier: number,

    /**
     * ホスト
     */
    public readonly host: string,

    /**
     * フレンドリー名
     */
    public readonly friendlyName: string
  ) {}
}
