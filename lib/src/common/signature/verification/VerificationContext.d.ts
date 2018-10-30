/**
 * Verification context for KSI signature
 */
import bigInteger, { BigInteger } from 'big-integer';
import { DataHash } from 'gt-js-common';
import { PublicationData } from '../../publication/PublicationData';
import { PublicationsFile } from '../../publication/PublicationsFile';
import { KsiService } from '../../service/KsiService';
import { CalendarHashChain } from '../CalendarHashChain';
import { IKsiSignature } from '../IKsiSignature';
export declare class VerificationContext {
    private ksiService;
    private readonly ksiSignature;
    private documentHash;
    private publicationsFile;
    private publicationData;
    private extendingAllowed;
    constructor(signature: IKsiSignature);
    getSignature(): IKsiSignature;
    /**
     * Get extended latest calendar hash chain.
     */
    getExtendedLatestCalendarHashChain(): Promise<CalendarHashChain>;
    /**
     * Get extended calendar hash chain from given publication time.
     */
    getExtendedCalendarHashChain(publicationTime: bigInteger.BigInteger | null): Promise<CalendarHashChain>;
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
    getPublicationsFile(): PublicationsFile | null;
    setPublicationsFile(publicationsFile: PublicationsFile | null): void;
    getUserPublication(): PublicationData | null;
    setUserPublication(publicationData: PublicationData | null): void;
    isExtendingAllowed(): boolean;
    setExtendingAllowed(extendingAllowed: boolean): void;
}
