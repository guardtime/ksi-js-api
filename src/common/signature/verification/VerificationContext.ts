import {DataHash} from '@guardtime/gt-js-common';
import bigInteger, {BigInteger} from 'big-integer';
import {PublicationData} from '../../publication/PublicationData';
import {PublicationsFile} from '../../publication/PublicationsFile';
import {KsiService} from '../../service/KsiService';
import {CalendarHashChain} from '../CalendarHashChain';
import {KsiSignature} from '../KsiSignature';
import {KsiVerificationError} from './KsiVerificationError';

/**
 * Verification context for KSI signature
 */
export class VerificationContext {
    private ksiService: KsiService | null = null;
    private readonly ksiSignature: KsiSignature;
    private documentHash: DataHash | null = null;
    private publicationsFile: PublicationsFile | null = null;
    private publicationData: PublicationData | null = null;
    private extendingAllowed: boolean = true;
    private documentHashLevel: BigInteger = bigInteger(0);

    constructor(signature: KsiSignature) {
        this.ksiSignature = signature;
    }

    public getSignature(): KsiSignature {
        return this.ksiSignature;
    }

    /**
     * Get extended latest calendar hash chain.
     */
    public async getExtendedLatestCalendarHashChain(): Promise<CalendarHashChain> {
        return this.getExtendedCalendarHashChain(null);
    }

    /**
     * Get extended calendar hash chain from given publication time.
     */
    public async getExtendedCalendarHashChain(publicationTime: BigInteger | null): Promise<CalendarHashChain> {
        if (!this.ksiService) {
            throw new KsiVerificationError('Invalid KSI service in context.');
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
        this.documentHash = documentHash;
    }

    public setKsiService(ksiService: KsiService | null): void {
        this.ksiService = ksiService;
    }

    /**
     * Get document hash node level value in the aggregation tree
     */
    public getDocumentHashLevel(): BigInteger {
        return this.documentHashLevel;
    }

    public setDocumentHashLevel(documentHashLevel: BigInteger): void {
        this.documentHashLevel = documentHashLevel;
    }

    public getPublicationsFile(): PublicationsFile | null {
        return this.publicationsFile;
    }

    public setPublicationsFile(publicationsFile: PublicationsFile | null): void {
        this.publicationsFile = publicationsFile;
    }

    public getUserPublication(): PublicationData | null {
        return this.publicationData;
    }

    public setUserPublication(publicationData: PublicationData | null): void {
        this.publicationData = publicationData;
    }

    public isExtendingAllowed(): boolean {
        return this.extendingAllowed;
    }

    public setExtendingAllowed(extendingAllowed: boolean): void {
        this.extendingAllowed = extendingAllowed;
    }
}
