import { BigInteger } from 'big-integer';
import { DataHash } from 'gt-js-common';
import { PublicationData } from '../../publication/PublicationData';
import { PublicationsFile } from '../../publication/PublicationsFile';
import { KsiService } from '../../service/KsiService';
import { CalendarHashChain } from '../CalendarHashChain';
import { KsiSignature } from '../KsiSignature';
/**
 * Verification context for KSI signature
 */
export declare class VerificationContext {
    private ksiService;
    private readonly ksiSignature;
    private documentHash;
    private publicationsFile;
    private publicationData;
    private extendingAllowed;
    private documentHashLevel;
    constructor(signature: KsiSignature);
    getSignature(): KsiSignature;
    /**
     * Get extended latest calendar hash chain.
     */
    getExtendedLatestCalendarHashChain(): Promise<CalendarHashChain>;
    /**
     * Get extended calendar hash chain from given publication time.
     */
    getExtendedCalendarHashChain(publicationTime: BigInteger | null): Promise<CalendarHashChain>;
    /**
     * Get document hash.
     */
    getDocumentHash(): DataHash | null;
    setDocumentHash(documentHash: DataHash | null): void;
    setKsiService(ksiService: KsiService | null): void;
    /**
     * Get document hash node level value in the aggregation tree
     */
    getDocumentHashLevel(): BigInteger;
    setDocumentHashLevel(documentHashLevel: BigInteger): void;
    getPublicationsFile(): PublicationsFile | null;
    setPublicationsFile(publicationsFile: PublicationsFile | null): void;
    getUserPublication(): PublicationData | null;
    setUserPublication(publicationData: PublicationData | null): void;
    isExtendingAllowed(): boolean;
    setExtendingAllowed(extendingAllowed: boolean): void;
}
