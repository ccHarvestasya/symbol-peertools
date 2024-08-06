export class PacketBuffer {
  private _length: number
  private _index: number

  constructor(private readonly _buffer: Buffer) {
    this._length = _buffer.length
    this._index = 0
  }

  addOffset(addOffset: number): number {
    this._index += addOffset
    return this._index
  }

  readUInt8(addOffset: number = 0): number {
    this.addOffset(addOffset)
    const readData = this._buffer.readUInt8(this._index)
    this._index += 1
    return readData
  }

  readUInt16LE(addOffset: number = 0): number {
    this.addOffset(addOffset)
    const readData = this._buffer.readUInt16LE(this._index)
    this._index += 2
    return readData
  }

  readUInt32LE(addOffset: number = 0): number {
    this.addOffset(addOffset)
    const readData = this._buffer.readUInt32LE(this._index)
    this._index += 4
    return readData
  }

  readBigUInt64LE(addOffset: number = 0): bigint {
    this.addOffset(addOffset)
    const readData = this._buffer.readBigUInt64LE(this._index)
    this._index += 8
    return readData
  }

  readString(length: number, addOffset: number = 0): string {
    this.addOffset(addOffset)
    const readData = this._buffer.toString('utf8', this._index, this._index + length)
    this._index += length
    return readData
  }

  readHexString(length: number, addOffset: number = 0): string {
    this.addOffset(addOffset)
    const readData = this._buffer.toString('hex', this._index, this._index + length)
    this._index += length
    return readData
  }

  get index(): number {
    return this._index
  }

  get length(): number {
    return this._length
  }
}
