/**
 * Verification context for KSI signature
 */
import bigInteger, {BigInteger} from 'big-integer';
import {DataHash} from 'gt-js-common';
import {PublicationData} from '../../publication/PublicationData';
import {PublicationsFile} from '../../publication/PublicationsFile';
import {KsiService} from '../../service/KsiService';
import {CalendarHashChain} from '../CalendarHashChain';
import {IKsiSignature, isKsiSignature} from '../IKsiSignature';
import {KsiVerificationError} from './KsiVerificationError';

export class VerificationContext {
    private ksiService: KsiService | null;
    private readonly ksiSignature: IKsiSignature;
    private documentHash: DataHash | null = null;
    private publicationsFile: PublicationsFile | null = null;
    private publicationData: PublicationData | null = null;
    private extendingAllowed: boolean = false;

    constructor(signature: IKsiSignature) {
        if (!isKsiSignature(signature)) {
            throw new Error(`Invalid signature: ${signature}`);
        }

        this.ksiSignature = signature;
    }

    public getSignature(): IKsiSignature {
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
    public async getExtendedCalendarHashChain(publicationTime: bigInteger.BigInteger | null): Promise<CalendarHashChain> {
        if (!(this.ksiService instanceof KsiService)) {
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
        if (documentHash !== null && !(documentHash instanceof DataHash)) {
            throw new KsiVerificationError(`Invalid document hash: ${documentHash}`);
        }

        this.documentHash = documentHash;
    }

    public setKsiService(ksiService: KsiService | null): void {
        if (ksiService !== null && !(ksiService instanceof KsiService)) {
            throw new KsiVerificationError(`Invalid ksi service: ${ksiService}`);
        }

        this.ksiService = ksiService;
    }

    /**
     * Get document hash node level value in the aggregation tree
     */
    public getDocumentHashLevel(): BigInteger {
        return bigInteger(0);
    }

    public getPublicationsFile(): PublicationsFile | null {
        return this.publicationsFile;
    }

    public setPublicationsFile(publicationsFile: PublicationsFile | null): void {
        if (publicationsFile !== null && !(publicationsFile instanceof PublicationsFile)) {
            throw new KsiVerificationError(`Invalid publications file: ${publicationsFile}`);
        }

        this.publicationsFile = publicationsFile;
    }

    public getUserPublication(): PublicationData | null {
        return this.publicationData;
    }

    public setUserPublication(publicationData: PublicationData | null): void {
        if (publicationData !== null && !(publicationData instanceof PublicationData)) {
            throw new KsiVerificationError(`Invalid publications file: ${publicationData}`);
        }

        this.publicationData = publicationData;
    }

    public isExtendingAllowed(): boolean {
        return this.extendingAllowed;
    }

    public setExtendingAllowed(extendingAllowed: boolean): void {
        this.extendingAllowed = extendingAllowed;
    }
}
