import bigInteger, {BigInteger} from 'big-integer';

import {DataHash, DataHasher, HashAlgorithm} from 'gt-js-common';
import {CALENDAR_HASH_CHAIN_CONSTANTS, LinkDirection} from '../Constants';
import {CompositeTag, ICount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {PublicationData} from '../publication/PublicationData';

/**
 * Calendar Hash Chain TLV Object
 */
export class CalendarHashChain extends CompositeTag {

    private chainLinks: ImprintTag[] = [];
    private publicationTime: IntegerTag;
    private aggregationTime: IntegerTag;
    private inputHash: ImprintTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    /**
     * Calculate highest bit.
     */
    private static highBit(n: BigInteger): BigInteger {
        let v: BigInteger = n;
        v = v.or(v.shiftRight(1));
        v = v.or(v.shiftRight(2));
        v = v.or(v.shiftRight(4));
        v = v.or(v.shiftRight(8));
        v = v.or(v.shiftRight(16));
        v = v.or(v.shiftRight(32));

        return v.minus(v.shiftRight(1));
    }

    /**
     * Hash two hashes together with algorithm.
     */
    private static async getStepHash(algorithm: HashAlgorithm, hashA: Uint8Array, hashB: Uint8Array): Promise<DataHash> {
        const hasher: DataHasher = new DataHasher(algorithm);
        hasher.update(hashA);
        hasher.update(hashB);
        hasher.update(new Uint8Array([0xFF]));

        return hasher.digest();
    }

    /**
     * Compare right links if they are equal.
     */
    public areRightLinksEqual(calendarHashChain: CalendarHashChain): boolean {
        let i: number = 0;
        let j: number = 0;
        while (i < this.chainLinks.length || j < calendarHashChain.chainLinks.length) {
            if (this.chainLinks[i].id !== LinkDirection.Right) {
                i += 1;
                continue;
            }

            if (calendarHashChain.chainLinks[j].id !== LinkDirection.Right) {
                j += 1;
                continue;
            }

            if (!this.chainLinks[i].getValue().equals(calendarHashChain.chainLinks[j].getValue())) {
                return false;
            }

            i += 1;
            j += 1;
        }

        return true;
}

    public calculateRegistrationTime(): BigInteger {
        let r: BigInteger = this.publicationTime.getValue();
        let t: BigInteger = bigInteger(0);

        // iterate over the chain in reverse
        for (let i: number = this.chainLinks.length - 1; i >= 0; i -= 1) {
            if (r.leq(0)) {
                console.warn('Invalid calendar hash chain shape for publication time. Cannot calculate registration time.');

                return bigInteger(0);
            }

            if (this.chainLinks[i].id === LinkDirection.Left) {
                r = CalendarHashChain.highBit(r).minus(1);
            } else {
                t = t.plus(CalendarHashChain.highBit(r));
                r = r.minus(CalendarHashChain.highBit(r));
            }
        }

        if (r.neq(0)) {
            console.warn('Calendar hash chain shape inconsistent with publication time. Cannot calculate registration time.');

            return bigInteger(0);
        }

        return t;
    }

    public getChainLinks(): ImprintTag[] {
        return this.chainLinks;
    }

    public getPublicationTime(): bigInteger.BigInteger {
        return this.publicationTime.getValue();
    }

    public getInputHash(): DataHash {
        return this.inputHash.getValue();
    }

    public getAggregationTime(): bigInteger.BigInteger {
        return this.aggregationTime ? this.aggregationTime.getValue() : this.getPublicationTime();
    }

    /**
     * Calculate output hash.
     */
    public async calculateOutputHash(): Promise<DataHash> {
        let inputHash: DataHash = this.getInputHash();
        for (const link of this.getChainLinks()) {
            const siblingHash: DataHash = link.getValue();

            if (link.id === LinkDirection.Left) {
                inputHash = await CalendarHashChain.getStepHash(siblingHash.hashAlgorithm, inputHash.imprint, siblingHash.imprint);
            }

            if (link.id === LinkDirection.Right) {
                inputHash = await CalendarHashChain.getStepHash(inputHash.hashAlgorithm, siblingHash.imprint, inputHash.imprint);
            }
        }

        return inputHash;
    }

    public async getPublicationData(): Promise<PublicationData> {
        return PublicationData.CREATE(this.publicationTime.getValue(), await this.calculateOutputHash());
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType:
                return this.publicationTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case LinkDirection.Left:
            case LinkDirection.Right:
                const link: ImprintTag = new ImprintTag(tlvTag);
                this.chainLinks.push(link);

                return link;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ICount): void {
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType) !== 1) {
            throw new TlvError('Exactly one publication time must exist in calendar hash chain.');
        }

        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType) > 1) {
            throw new TlvError('Only one aggregation time is allowed in calendar hash chain.');
        }

        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType) !== 1) {
            throw new TlvError('Exactly one input hash must exist in calendar hash chain.');
        }

        if (this.chainLinks.length === 0) {
            throw new TlvError('Links are missing in calendar hash chain.');
        }
    }
}
