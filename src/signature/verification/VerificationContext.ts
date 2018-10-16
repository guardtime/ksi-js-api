/**
 * Verification context for KSI signature
 */
import bigInteger, {BigInteger} from 'big-integer';
import {TlvTag} from '../../parser/TlvTag';
import {CalendarHashChain} from '../CalendarHashChain';
import {KsiSignature} from '../KsiSignature';
import {KsiVerificationError} from './KsiVerificationError';
import {DataHash} from 'gt-js-common';

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

    public getSignature(): KsiSignature {
        return new KsiSignature(new TlvTag(0, false, false, new Uint8Array(0)));
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
    public getDocumentHash(): DataHash {
        const hashImprint: Uint8Array = new Uint8Array(33);
        hashImprint.set([1]);

        return new DataHash(hashImprint);
    }

    /**
     * Get document hash node level value in the aggregation tree
     */
    public getDocumentHashLevel(): bigInteger.BigInteger {
        return bigInteger(0);
    }
}
