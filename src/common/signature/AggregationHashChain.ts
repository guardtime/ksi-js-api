/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import {DataHash, DataHasher, HashAlgorithm, UnsignedLongCoder, Utf8Converter} from '@guardtime/gt-js-common';
import bigInteger, {BigInteger} from 'big-integer';
import {AGGREGATION_HASH_CHAIN_CONSTANTS, LinkDirection} from '../Constants';
import {CompositeTag, ICount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {RawTag} from '../parser/RawTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {IKsiIdentity} from './IKsiIdentity';
import {LegacyIdentity} from './LegacyIdentity';

/**
 * Aggregation Hash Chain Link Metadata TLV Object
 */
export class AggregationHashChainLinkMetaData extends CompositeTag implements IKsiIdentity {
    private padding: RawTag | null = null;
    private clientId: StringTag;
    private machineId: StringTag | null = null;
    private sequenceNumber: IntegerTag | null = null;
    private requestTime: IntegerTag | null = null;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public getClientId(): string {
        return this.clientId.getValue();
    }

    public getMachineId(): string | null {
        return this.machineId === null ? null : this.machineId.getValue();
    }

    public getSequenceNumber(): BigInteger | null {
        return this.sequenceNumber === null ? null : this.sequenceNumber.getValue();
    }

    public getRequestTime(): BigInteger | null {
        return this.requestTime === null ? null : this.requestTime.getValue();
    }

    public getPaddingTag(): RawTag | null {
        return this.padding;
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingTagType:
                return this.padding = new RawTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType:
                return this.clientId = new StringTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType:
                return this.machineId = new StringTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType:
                return this.sequenceNumber = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType:
                return this.requestTime = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    // noinspection JSMethodCanBeStatic
    private validate(tagCount: ICount): void {
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType) !== 1) {
            throw new TlvError('Exactly one client id must exist in aggregation hash chain link metadata.');
        }

        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType) > 1) {
            throw new TlvError('Only one machine id is allowed in aggregation hash chain link metadata.');
        }

        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType) > 1) {
            throw new TlvError('Only one sequence number is allowed in aggregation hash chain link metadata.');
        }

        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType) > 1) {
            throw new TlvError('Only one request time is allowed in aggregation hash chain link metadata.');
        }
    }
}

/**
 * Aggregation Hash Chain Link TLV Object
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

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        switch (this.id) {
            case LinkDirection.Left:
                this.direction = LinkDirection.Left;
                break;
            case LinkDirection.Right:
                this.direction = LinkDirection.Right;
                break;
            default:
                throw new TlvError('Invalid Link direction.');
        }

        Object.freeze(this);
    }

    private static getLegacyIdString(bytes: Uint8Array): string {
        if (bytes.length === 0) {
            throw new TlvError('Invalid legacy id tag: empty.');
        }

        if (bytes[0] !== AggregationHashChainLink.LEGACY_ID_FIRST_OCTET) {
            throw new TlvError(`Invalid first octet in legacy id tag: 0x${bytes[0].toString(16)}.`);
        }

        if (bytes[1] !== 0x0) {
            throw new TlvError(`Invalid second octet in legacy id tag: 0x${bytes[1].toString(16)}.`);
        }

        if (bytes.length !== AggregationHashChainLink.LEGACY_ID_LENGTH) {
            throw new TlvError(`Invalid legacy id tag length. Length: ${bytes.length}.`);
        }

        const idStringLength: number = bytes[2];

        if (bytes.length <= idStringLength + 3) {
            throw new TlvError(`Invalid legacy id length value: ${idStringLength}.`);
        }

        for (let i: number = idStringLength + 3; i < bytes.length; i += 1) {
            if (bytes[i] !== 0x0) {
                throw new TlvError(`Invalid padding octet. Index: ${i}.`);
            }
        }

        return Utf8Converter.ToString(bytes.slice(3, idStringLength + 3));
    }

    public getLevelCorrection(): BigInteger {
        return this.levelCorrection === null ? bigInteger(0) : this.levelCorrection.getValue();
    }

    public getMetadata(): AggregationHashChainLinkMetaData | null {
        return this.metadata;
    }

    public getDirection(): LinkDirection {
        return this.direction;
    }

    public getSiblingData(): Uint8Array {
        if (this.siblingHash !== null) {
            return this.siblingHash.getValue().imprint;
        }

        if (this.legacyId !== null) {
            return this.legacyId.getValue();
        }

        return (<AggregationHashChainLinkMetaData>this.metadata).getValueBytes();
    }

    public getIdentity(): IKsiIdentity | null {
        if (this.legacyId !== null) {
            return new LegacyIdentity(this.legacyIdString);
        }

        return this.metadata;
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType:
                return this.levelCorrection = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType:
                return this.siblingHash = new ImprintTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId:
                const legacyIdTag: RawTag = new RawTag(tlvTag);
                this.legacyId = legacyIdTag;
                // TODO: Make it better
                this.legacyIdString = AggregationHashChainLink.getLegacyIdString(legacyIdTag.getValue());

                return legacyIdTag;
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType:
                return this.metadata = new AggregationHashChainLinkMetaData(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    // noinspection JSMethodCanBeStatic
    private validate(tagCount: ICount): void {
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType) > 1) {
            throw new TlvError('Only one LevelCorrection value is allowed in aggregation hash chain link.');
        }

        if (((tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType) || 0) +
            (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId) || 0) +
            (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType) || 0)) !== 1) {

            throw new TlvError('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
        }
    }
}

export type AggregationHashResult = Readonly<{ level: BigInteger; hash: DataHash }>;

/**
 * Aggregation Hash Chain TLV Object
 */
export class AggregationHashChain extends CompositeTag {
    private chainIndexes: IntegerTag[] = [];
    private aggregationTime: IntegerTag;
    private chainLinks: AggregationHashChainLink[] = [];
    private aggregationAlgorithm: HashAlgorithm;
    private inputHash: ImprintTag;
    private inputData: RawTag | null = null;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public getChainLinks(): AggregationHashChainLink[] {
        return this.chainLinks;
    }

    /**
     * Get chain index values
     */
    public getChainIndex(): BigInteger[] {
        const result: BigInteger[] = [];
        for (const tag of this.chainIndexes) {
            result.push(tag.getValue());
        }

        return result;
    }

    public getAggregationTime(): BigInteger {
        return this.aggregationTime.getValue();
    }

    public getAggregationAlgorithm(): HashAlgorithm {
        return this.aggregationAlgorithm;
    }

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

        return Object.freeze({level: level, hash: lastHash});
    }

    public getInputHash(): DataHash {
        return this.inputHash.getValue();
    }

    public getInputData(): Uint8Array | null {
        return this.inputData === null ? null : this.inputData.getValue();
    }

    /**
     * Returns location pointer based on aggregation hash chain links
     */
    public calculateLocationPointer(): BigInteger {
        let result: BigInteger = bigInteger(0);
        const links: AggregationHashChainLink[] = this.getChainLinks();

        for (let i: number = 0; i < this.getChainLinks().length; i += 1) {
            if (links[i].getDirection() === LinkDirection.Left) {
                result = result.or(bigInteger(1).shiftLeft(i));
            }
        }

        return result.or(bigInteger(1).shiftLeft(links.length));
    }

    private async getStepHash(hashA: Uint8Array, hashB: Uint8Array, level: BigInteger): Promise<DataHash> {
        const hasher: DataHasher = new DataHasher(this.aggregationAlgorithm);
        hasher.update(hashA);
        hasher.update(hashB);
        hasher.update(UnsignedLongCoder.encode(level));

        return hasher.digest();
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType:
                const chainIndexTlvTag: IntegerTag = new IntegerTag(tlvTag);
                this.chainIndexes.push(chainIndexTlvTag);

                return chainIndexTlvTag;
            case AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType:
                return this.inputData = new RawTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
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
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ICount): void {
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType) !== 1) {
            throw new TlvError('Exactly one aggregation time must exist in aggregation hash chain.');
        }

        if (this.chainIndexes.length === 0) {
            throw new TlvError('Chain index is missing in aggregation hash chain.');
        }

        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType) > 1) {
            throw new TlvError('Only one input data value is allowed in aggregation hash chain.');
        }

        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType) !== 1) {
            throw new TlvError('Exactly one input hash must exist in aggregation hash chain.');
        }

        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType) !== 1) {
            throw new TlvError('Exactly one algorithm must exist in aggregation hash chain.');
        }

        if (this.chainLinks.length === 0) {
            throw new TlvError('Links are missing in aggregation hash chain.');
        }
    }

}
