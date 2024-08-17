import { ChainInfo, LatestFinalizedBlock } from './model/ChainInfo.js'
import { ChainStatistics } from './model/ChainStatistics.js'
import { DiagnosticCounter } from './model/DiagnosticCounter.js'
import { FinalizationStatistics } from './model/FinalizationStatistics.js'
import { NodeInfo } from './model/NodeInfo.js'
import { NodePeer } from './model/NodePeer.js'
import { NodeTime } from './model/NodeTime.js'
import { NodeUnlockedAccount } from './model/NodeUnlockedAccount.js'
import { PacketBuffer } from './PacketBuffer.js'
import { SslSocket } from './SslSocket.js'

export class Catapult extends SslSocket {
  // private STATE_PATH_BASE_TYPE = 0x200
  /** パケットタイプ */
  private PacketType = {
    CHAIN_STATISTICS: 5,
    NODE_DISCOVERY_PULL_PING: 0x111,
    NODE_DISCOVERY_PULL_PEERS: 0x113,
    FINALIZATION_STATISTICS: 0x132,
    TIME_SYNC_NETWORK_TIME: 0x120,
    UNLOCKED_ACCOUNTS: 0x304,
    DIAGNOSTIC_COUNTERS: 0x300,
    PUSH_TRANSACTIONS: 0x009,
    PUSH_PARTIAL_TRANSACTIONS: 0x100,
    // ACCOUNT_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x43,
    // HASH_LOCK_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x48,
    // SECRET_LOCK_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x52,
    // METADATA_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x44,
    // MOSAIC_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x4d,
    // MULTISIG_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x55,
    // NAMESPACE_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x4e,
    // ACCOUNT_RESTRICTIONS_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x50,
    // MOSAIC_RESTRICTIONS_STATE_PATH: this.STATE_PATH_BASE_TYPE + 0x51,
  }

  /**
   * NodePeers取得
   * @returns 成功: NodePeer[], 失敗: undefined
   */
  async getNodePeers(): Promise<NodePeer[] | undefined> {
    let nodePeers: NodePeer[] | undefined = []
    try {
      // ピア問合せ
      const socketData = await this.requestSocket(this.PacketType.NODE_DISCOVERY_PULL_PEERS)
      if (!socketData) return undefined
      const nodeBufferView = new PacketBuffer(Buffer.from(socketData))
      // 編集
      while (nodeBufferView.index < nodeBufferView.length) {
        const version = nodeBufferView.readUInt32LE(4)
        const publicKey = nodeBufferView.readHexString(32).toUpperCase()
        const networkGenerationHashSeed = nodeBufferView.readHexString(32).toUpperCase()
        const roles = nodeBufferView.readUInt32LE()
        const port = nodeBufferView.readUInt16LE()
        const networkIdentifier = nodeBufferView.readUInt8()
        const hostLength = nodeBufferView.readUInt8()
        const friendlyNameLength = nodeBufferView.readUInt8()
        const host = nodeBufferView.readString(hostLength)
        const friendlyName = nodeBufferView.readString(friendlyNameLength)

        const nodePeer = new NodePeer(
          version,
          publicKey,
          networkGenerationHashSeed,
          roles,
          port,
          networkIdentifier,
          host,
          friendlyName
        )
        nodePeers.push(nodePeer)
      }
    } catch (e) {
      nodePeers = undefined
    }
    return nodePeers
  }

  /**
   * NodeInfo取得
   * @returns 成功: NodeInfo, 失敗: undefined
   */
  async getNodeInfo(): Promise<NodeInfo | undefined> {
    let nodeInfo: NodeInfo | undefined = undefined
    try {
      // ピア問合せ
      const socketData = await this.requestSocket(this.PacketType.NODE_DISCOVERY_PULL_PING)
      if (!socketData) return undefined
      // 編集
      const nodeBufferView = new PacketBuffer(Buffer.from(socketData))
      const version = nodeBufferView.readUInt32LE(4)
      const publicKey = nodeBufferView.readHexString(32).toUpperCase()
      const networkGenerationHashSeed = nodeBufferView.readHexString(32).toUpperCase()
      const roles = nodeBufferView.readUInt32LE()
      const port = nodeBufferView.readUInt16LE()
      const networkIdentifier = nodeBufferView.readUInt8()
      const hostLength = nodeBufferView.readUInt8()
      const friendlyNameLength = nodeBufferView.readUInt8()
      const host = nodeBufferView.readString(hostLength)
      const friendlyName = nodeBufferView.readString(friendlyNameLength)
      // 証明書有効期限、ノード公開鍵取得
      const nodePublicKey = this._x509Certificate!.publicKey.export({
        format: 'der',
        type: 'spki',
      })
        .toString('hex', 12, 44)
        .toUpperCase()
      const validTo = this._x509Certificate!.validTo
      const validToDate = new Date(validTo)
      const certificateExpirationDate = validToDate
      nodeInfo = new NodeInfo(
        version,
        publicKey,
        networkGenerationHashSeed,
        roles,
        port,
        networkIdentifier,
        host,
        friendlyName,
        nodePublicKey,
        certificateExpirationDate
      )
    } catch (e) {
      nodeInfo = undefined
    }
    return nodeInfo
  }

  /**
   * ブロック情報取得(/chain/info同等)
   */
  async getChainInfo() {
    let chainStat = await this.getChainStatistics()
    let finalStat = await this.getFinalizationStatistics()
    let latestFinalizedBlock = new LatestFinalizedBlock(
      finalStat!.epoch,
      finalStat!.point,
      finalStat!.height,
      finalStat!.hash
    )
    let chainInfo = new ChainInfo(chainStat!.height, chainStat!.scoreHigh, chainStat!.scoreLow, latestFinalizedBlock)
    return chainInfo
  }

  /**
   * ChainStatistics取得
   * @returns 成功: ChainStatistics, 失敗: undefined
   */
  async getChainStatistics() {
    let chainStatistics: ChainStatistics | undefined = undefined
    try {
      const socketData = await this.requestSocket(this.PacketType.CHAIN_STATISTICS)
      if (!socketData) return undefined
      const bufferView = new PacketBuffer(Buffer.from(socketData))
      const height = bufferView.readBigUInt64LE()
      const finalizedHeight = bufferView.readBigUInt64LE()
      const scoreHigh = bufferView.readBigUInt64LE()
      const scoreLow = bufferView.readBigUInt64LE()
      chainStatistics = new ChainStatistics(
        height.toString(),
        finalizedHeight.toString(),
        scoreHigh.toString(),
        scoreLow.toString()
      )
    } catch (e) {
      chainStatistics = undefined
    }
    return chainStatistics
  }

  /**
   * FinalizationStatistics取得
   * @returns 成功: FinalizationStatistics, 失敗: undefined
   */
  async getFinalizationStatistics() {
    let finalizationStatistics: FinalizationStatistics | undefined = undefined
    try {
      const socketData = await this.requestSocket(this.PacketType.FINALIZATION_STATISTICS)
      if (!socketData) return undefined
      const bufferView = new PacketBuffer(Buffer.from(socketData))
      const epoch = bufferView.readUInt32LE()
      const point = bufferView.readUInt32LE()
      const height = bufferView.readBigUInt64LE()
      const hash = bufferView.readHexString(32).toUpperCase()
      finalizationStatistics = new FinalizationStatistics(epoch, point, height.toString(), hash)
    } catch (e) {
      finalizationStatistics = undefined
    }
    return finalizationStatistics
  }

  /**
   * NodeUnlockedAccount取得
   * @returns 成功: NodeUnlockedAccount, 失敗: undefined
   */
  async getNodeUnlockedAccount() {
    let nodeUnlockedAccount: NodeUnlockedAccount | undefined = undefined
    try {
      // ピア問合せ
      const socketData = await this.requestSocket(this.PacketType.UNLOCKED_ACCOUNTS)
      if (!socketData) return undefined
      // 編集
      const nodeBufferView = new PacketBuffer(Buffer.from(socketData))
      const unlockedAccount: string[] = []
      while (nodeBufferView.index < nodeBufferView.length) {
        unlockedAccount.push(nodeBufferView.readHexString(32).toUpperCase())
      }
      nodeUnlockedAccount = new NodeUnlockedAccount(unlockedAccount)
    } catch (e) {
      nodeUnlockedAccount = undefined
    }
    return nodeUnlockedAccount
  }

  /**
   * NodeTime取得
   * @returns 成功: NodeTime, 失敗: undefined
   */
  async getNodeTime() {
    let nodeTime: NodeTime | undefined = undefined
    try {
      // ピア問合せ
      const socketData = await this.requestSocket(this.PacketType.TIME_SYNC_NETWORK_TIME)
      if (!socketData) return undefined
      // 編集
      const nodeBufferView = Buffer.from(socketData)
      nodeTime = new NodeTime({
        sendTimestamp: nodeBufferView.readBigUInt64LE(0).toString(),
        receiveTimestamp: nodeBufferView.readBigUInt64LE(8).toString(),
      })
    } catch (e) {
      nodeTime = undefined
    }
    return nodeTime
  }

  /**
   * DiagnosticCounters取得
   * @returns 診断カウンター
   */
  async getDiagnosticCounters(): Promise<DiagnosticCounter[] | undefined> {
    let diagnosticCounters: DiagnosticCounter[] | undefined = undefined
    try {
      // ピア問合せ
      const socketData = await this.requestSocket(this.PacketType.DIAGNOSTIC_COUNTERS)
      if (!socketData) return undefined
      const nodeBufferView = new PacketBuffer(Buffer.from(socketData))
      // 編集
      diagnosticCounters = []
      while (nodeBufferView.index < nodeBufferView.length) {
        let itemNameBin = nodeBufferView.readBigUInt64LE()
        let itemNameWork = ''
        for (let i = 0; i < 13; i++) {
          const byte = itemNameBin % 27n
          const char = byte === 0n ? ' ' : Buffer.from((64n + byte).toString(16), 'hex').toString('utf-8')
          itemNameWork = char + itemNameWork
          itemNameBin /= 27n
        }
        const itemValueWork = nodeBufferView.readBigUInt64LE()
        const dCounter = new DiagnosticCounter(itemNameWork, itemValueWork.toString())
        diagnosticCounters.push(dCounter)
      }
    } catch {
      diagnosticCounters = undefined
    }
    return diagnosticCounters
  }

  /**
   * トランザクションアナウンス
   * @param payload トランザクションペイロード(Hex文字列)
   */
  async announceTx(payloadHex: string): Promise<boolean> {
    const payload = Uint8Array.from(Buffer.from(payloadHex, 'hex'))
    try {
      await this.requestSocket(this.PacketType.PUSH_TRANSACTIONS, payload, false)
    } catch (e) {
      return false
    }
    return true
  }

  /**
   * アグリゲートボンデッドトランザクションアナウンス
   * API必要
   * @param payloadHex トランザクションペイロード(Hex文字列)
   * @returns
   */
  async announceTxPartial(payloadHex: string): Promise<boolean> {
    const payload = Uint8Array.from(Buffer.from(payloadHex, 'hex'))
    try {
      await this.requestSocket(this.PacketType.PUSH_PARTIAL_TRANSACTIONS, payload, false)
    } catch (e) {
      return false
    }
    return true
  }
}
