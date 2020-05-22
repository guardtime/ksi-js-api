/*
 * Copyright 2013-2020 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import UnsignedLongCoder from '@guardtime/common/lib/coders/UnsignedLongCoder';
import DataHash from '@guardtime/common/lib/hash/DataHash';
import DataHasher from '@guardtime/common/lib/hash/DataHasher';
import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import Utf8Converter from '@guardtime/common/lib/strings/Utf8Converter';
import bigInteger, { BigInteger } from 'big-integer';
import { AGGREGATION_HASH_CHAIN_CONSTANTS, LinkDirection } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { RawTag } from '../parser/RawTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { IKsiIdentity } from './IKsiIdentity';
import { LegacyIdentity } from './LegacyIdentity';

/**
 * Aggregation hash chain link metadata TLV object.
 */
export class AggregationHashChainLinkMetaData extends CompositeTag implements IKsiIdentity {
  private padding: RawTag | null = null;
  private clientId: StringTag;
  private machineId: StringTag | null = null;
  private sequenceNumber: IntegerTag | null = null;
  private requestTime: IntegerTag | null = null;

  /**
   * Aggregation hash chain link metadata TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * @inheritDoc
   */
  public getClientId(): string {
    return this.clientId.getValue();
  }

  /**
   * @inheritDoc
   */
  public getMachineId(): string | null {
    return this.machineId === null ? null : this.machineId.getValue();
  }

  /**
   * @inheritDoc
   */
  public getSequenceNumber(): BigInteger | null {
    return this.sequenceNumber === null ? null : this.sequenceNumber.getValue();
  }

  /**
   * @inheritDoc
   */
  public getRequestTime(): BigInteger | null {
    return this.requestTime === null ? null : this.requestTime.getValue();
  }

  /**
   * Get padding TLV object.
   * @returns Padding TLV object.
   */
  public getPaddingTag(): RawTag | null {
    return this.padding;
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingTagType:
        return (this.padding = new RawTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType:
        return (this.clientId = new StringTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType:
        return (this.machineId = new StringTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType:
        return (this.sequenceNumber = new IntegerTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType:
        return (this.requestTime = new IntegerTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType) !== 1) {
      throw new TlvError('Exactly one client ID must exist in aggregation hash chain link metadata.');
    }

    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType) > 1) {
      throw new TlvError('Only one machine ID is allowed in aggregation hash chain link metadata.');
    }

    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType) > 1) {
      throw new TlvError('Only one sequence number is allowed in aggregation hash chain link metadata.');
    }

    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType) > 1) {
      throw new TlvError('Only one request time is allowed in aggregation hash chain link metadata.');
    }
  }
}

/**
 * Aggregation hash chain link TLV object.
 */
export class AggregationHashChainLink extends CompositeTag {
  private static readonly LEGACY_ID_FIRST_OCTET: number = 0x3;
  private static readonly LEGACY_ID_LENGTH: number = 29;

  private readonly direction: LinkDirection;
  private levelCorrection: IntegerTag | null = null;
  private siblingHash: ImprintTag | null = null;
  private legacyId: RawTag | null = null;
  private legacyIdString: string;
  private metadata: AggregationHashChainLinkMetaData | null = null;

  /**
   * Aggregation hash chain link TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    switch (this.id) {
      case LinkDirection.Left:
        this.direction = LinkDirection.Left;
        break;
      case LinkDirection.Right:
        this.direction = LinkDirection.Right;
        break;
      default:
        throw new TlvError('Invalid link direction.');
    }

    Object.freeze(this);
  }

  /**
   * Get legacy ID string.
   * @param bytes Legacy ID bytes.
   * @returns Legacy ID string.
   */
  private static getLegacyIdString(bytes: Uint8Array): string {
    if (bytes.length === 0) {
      throw new TlvError('Invalid legacy ID tag: empty.');
    }

    if (bytes[0] !== AggregationHashChainLink.LEGACY_ID_FIRST_OCTET) {
      throw new TlvError(`Invalid first octet in legacy ID tag: 0x${bytes[0].toString(16)}.`);
    }

    if (bytes[1] !== 0x0) {
      throw new TlvError(`Invalid second octet in legacy ID tag: 0x${bytes[1].toString(16)}.`);
    }

    if (bytes.length !== AggregationHashChainLink.LEGACY_ID_LENGTH) {
      throw new TlvError(`Invalid legacy ID tag length. Length: ${bytes.length}.`);
    }

    const idStringLength: number = bytes[2];

    if (bytes.length <= idStringLength + 3) {
      throw new TlvError(`Invalid legacy ID length value: ${idStringLength}.`);
    }

    for (let i: number = idStringLength + 3; i < bytes.length; i += 1) {
      if (bytes[i] !== 0x0) {
        throw new TlvError(`Invalid padding octet. Index: ${i}.`);
      }
    }

    return Utf8Converter.ToString(bytes.slice(3, idStringLength + 3));
  }

  /**
   * Get level correction.
   * @returns Link level correction.
   */
  public getLevelCorrection(): BigInteger {
    return this.levelCorrection === null ? bigInteger(0) : this.levelCorrection.getValue();
  }

  /**
   * Get link metadata.
   * @returns Link metadata.
   */
  public getMetadata(): AggregationHashChainLinkMetaData | null {
    return this.metadata;
  }

  public getDirection(): LinkDirection {
    return this.direction;
  }

  /**
   * Get link sibling data.
   * @returns Sibling data.
   */
  public getSiblingData(): Uint8Array {
    if (this.siblingHash !== null) {
      return this.siblingHash.getValue().imprint;
    }

    if (this.legacyId !== null) {
      return this.legacyId.getValue();
    }

    return (this.metadata as AggregationHashChainLinkMetaData).getValueBytes();
  }

  /**
   * Get link identity.
   * @returns Link identity.
   */
  public getIdentity(): IKsiIdentity | null {
    if (this.legacyId !== null) {
      return new LegacyIdentity(this.legacyIdString);
    }

    return this.metadata;
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType:
        return (this.levelCorrection = new IntegerTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType:
        return (this.siblingHash = new ImprintTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId:
        const legacyIdTag: RawTag = new RawTag(tlvTag);
        this.legacyId = legacyIdTag;
        // TODO: Make it better
        this.legacyIdString = AggregationHashChainLink.getLegacyIdString(legacyIdTag.getValue());

        return legacyIdTag;
      case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType:
        return (this.metadata = new AggregationHashChainLinkMetaData(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType) > 1) {
      throw new TlvError('Only one LevelCorrection value is allowed in aggregation hash chain link.');
    }

    if (
      (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType) || 0) +
        (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId) || 0) +
        (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType) || 0) !==
      1
    ) {
      throw new TlvError(
        'Exactly one of three from sibling hash, legacy ID or metadata must exist in aggregation hash chain link.'
      );
    }
  }
}

export type AggregationHashResult = Readonly<{ level: BigInteger; hash: DataHash }>;

/**
 * Aggregation hash chain TLV object.
 */
export class AggregationHashChain extends CompositeTag {
  private chainIndexes: IntegerTag[] = [];
  private aggregationTime: IntegerTag;
  private chainLinks: AggregationHashChainLink[] = [];
  private aggregationAlgorithm: HashAlgorithm;
  private inputHash: ImprintTag;
  private inputData: RawTag | null = null;

  /**
   * Aggregation hash chain TLV object.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get chain links.
   * @returns Aggregation chain links.
   */
  public getChainLinks(): AggregationHashChainLink[] {
    return this.chainLinks;
  }

  /**
   * Get chain index values.
   * @returns Chain index values.
   */
  public getChainIndex(): BigInteger[] {
    const result: BigInteger[] = [];
    for (const tag of this.chainIndexes) {
      result.push(tag.getValue());
    }

    return result;
  }

  /**
   * Get aggregation time of current chain.
   * @returns Aggregation time.
   */
  public getAggregationTime(): BigInteger {
    return this.aggregationTime.getValue();
  }

  /**
   * Get chain hash algorithm.
   * @returns Aggregation chain hash algorithm.
   */
  public getAggregationAlgorithm(): HashAlgorithm {
    return this.aggregationAlgorithm;
  }

  /**
   * Get aggregation hash chain identity.
   * @returns Aggregation hash chain identity.
   */
  public getIdentity(): IKsiIdentity[] {
    const identity: IKsiIdentity[] = [];
    for (let i: number = this.chainLinks.length - 1; i >= 0; i -= 1) {
      const linkIdentity: IKsiIdentity | null = this.chainLinks[i].getIdentity();
      if (linkIdentity !== null) {
        identity.push(linkIdentity);
      }
    }

    return identity;
  }

  /**
   * Calculate current hash chain output hash from previous chain output hash and level.
   * @param result Previous aggregation hash chain level and output hash.
   * @returns Current aggregation hash chain level and output hash.
   */
  public async getOutputHash(result: AggregationHashResult): Promise<AggregationHashResult> {
    let level: BigInteger = result.level;
    let lastHash: DataHash = result.hash;

    for (const link of this.chainLinks) {
      level = level.plus(link.getLevelCorrection().plus(1));
      if (link.getDirection() === LinkDirection.Left) {
        lastHash = await this.getStepHash(lastHash.imprint, link.getSiblingData(), level);
      }

      if (link.getDirection() === LinkDirection.Right) {
        lastHash = await this.getStepHash(link.getSiblingData(), lastHash.imprint, level);
      }
    }

    return Object.freeze({ level: level, hash: lastHash });
  }

  /**
   * Get input hash.
   * @returns Input hash.
   */
  public getInputHash(): DataHash {
    return this.inputHash.getValue();
  }

  /**
   * Get input data if exists.
   * @returns Input data bytes if input data exists, otherwise null.
   */
  public getInputData(): Uint8Array | null {
    return this.inputData === null ? null : this.inputData.getValue();
  }

  /**
   * Returns location pointer based on aggregation hash chain links.
   * @returns Location pointer.
   */
  public calculateLocationPointer(): BigInteger {
    let result: BigInteger = bigInteger(0);
    const links: AggregationHashChainLink[] = this.getChainLinks();

    for (let i = 0; i < this.getChainLinks().length; i += 1) {
      if (links[i].getDirection() === LinkDirection.Left) {
        result = result.or(bigInteger(1).shiftLeft(i));
      }
    }

    return result.or(bigInteger(1).shiftLeft(links.length));
  }

  /**
   * Get current link step hash.
   * @param hashA First hash.
   * @param hashB Second hash.
   * @param level Link level.
   * @returns Result data hash.
   */
  private async getStepHash(hashA: Uint8Array, hashB: Uint8Array, level: BigInteger): Promise<DataHash> {
    const hasher: DataHasher = new DataHasher(this.aggregationAlgorithm);
    hasher.update(hashA);
    hasher.update(hashB);
    hasher.update(UnsignedLongCoder.encode(level));

    return hasher.digest();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
        return (this.aggregationTime = new IntegerTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType:
        const chainIndexTlvTag: IntegerTag = new IntegerTag(tlvTag);
        this.chainIndexes.push(chainIndexTlvTag);

        return chainIndexTlvTag;
      case AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType:
        return (this.inputData = new RawTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType:
        return (this.inputHash = new ImprintTag(tlvTag));
      case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType:
        const algorithmTag: IntegerTag = new IntegerTag(tlvTag);
        const algorithm: HashAlgorithm | null = HashAlgorithm.getById(algorithmTag.getValue().valueOf());
        if (algorithm === null) {
          throw new TlvError('Invalid algorithm: null');
        }

        this.aggregationAlgorithm = algorithm;

        return algorithmTag;
      case LinkDirection.Left:
      case LinkDirection.Right:
        const linkTag: AggregationHashChainLink = new AggregationHashChainLink(tlvTag);
        this.chainLinks.push(linkTag);

        return linkTag;
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType) !== 1) {
      throw new TlvError('Exactly one aggregation time must exist in aggregation hash chain.');
    }

    if (this.chainIndexes.length === 0) {
      throw new TlvError('Chain index is missing in aggregation hash chain.');
    }

    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType) > 1) {
      throw new TlvError('Only one input data value is allowed in aggregation hash chain.');
    }

    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType) !== 1) {
      throw new TlvError('Exactly one input hash must exist in aggregation hash chain.');
    }

    if (this.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType) !== 1) {
      throw new TlvError('Exactly one algorithm must exist in aggregation hash chain.');
    }

    if (this.chainLinks.length === 0) {
      throw new TlvError('Links are missing in aggregation hash chain.');
    }
  }
}
