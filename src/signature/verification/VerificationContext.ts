/**
 * Verification context for KSI signature
 */
import bigInteger, {BigInteger} from 'big-integer';
import {DataHash} from 'gt-js-common';
import {TlvTag} from '../../parser/TlvTag';
import {CalendarHashChain} from '../CalendarHashChain';
import {KsiSignature} from '../KsiSignature';
import {KsiVerificationError} from './KsiVerificationError';

export class KsiService {
    constructor() {
        return;
    }

    public extend(aggregationTime: bigInteger.BigInteger, publicationTime: bigInteger.BigInteger | null): CalendarHashChain {
        return new CalendarHashChain(new TlvTag(0, false, false, new Uint8Array(0)));
    }
}

export class VerificationContext {
    private ksiService: KsiService;
    private ksiSignature: KsiSignature;
    private documentHash: DataHash | null = null;

    constructor(signature: KsiSignature) {
        if (!(signature instanceof KsiSignature)) {
            throw new Error(`Invalid signature: ${signature}`);
        }

        this.ksiSignature = signature;

    }

    public getSignature(): KsiSignature {
        return this.ksiSignature;
    }

    /**
     * Get extended latest calendar hash chain.
     */
    public getExtendedLatestCalendarHashChain(): CalendarHashChain {
        return this.getExtendedCalendarHashChain(null);
    }

    /**
     * Get extended calendar hash chain from given publication time.
     */
    public getExtendedCalendarHashChain(publicationTime: bigInteger.BigInteger | null): CalendarHashChain {
        if (!(this.ksiService instanceof KsiService)) {
            throw new KsiVerificationError('Invalid KSI service in context.');
        }

        if (!(this.getSignature() instanceof KsiSignature)) {
            throw new KsiVerificationError('Invalid KSI signature in context.');
        }

        return this.ksiService.extend(this.getSignature().getAggregationTime(), publicationTime);
    }

    /**
     * Get document hash.
     */
    public getDocumentHash(): DataHash | null {
        return this.documentHash;
    }

    public setDocumentHash(documentHash: DataHash | null): void {
        if (documentHash === null || !(documentHash instanceof DataHash)) {
            throw new KsiVerificationError(`Invalid document hash: ${documentHash}`);
        }
        this.documentHash = documentHash;
    }

    /**
     * Get document hash node level value in the aggregation tree
     */
    public getDocumentHashLevel(): BigInteger {
        return bigInteger(0);
    }
}
