import { BigInteger } from 'big-integer';
import { DataHash } from 'gt-js-common';
import { IPublicationsFile } from '../publication/IPublicationsFile';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { KsiSignature } from '../signature/KsiSignature';
import { ExtendingService } from './ExtendingService';
import { PublicationsFileService } from './PublicationsFileService';
import { SigningService } from './SigningService';
/**
 * KSI service.
 */
export declare class KsiService {
    private readonly signingService;
    private readonly extendingService;
    private readonly publicationsFileService;
    constructor(signingService: SigningService | null | undefined, extendingService: ExtendingService | null | undefined, publicationsFileService: PublicationsFileService | null);
    sign(hash: DataHash, level?: BigInteger): Promise<KsiSignature>;
    extend(aggregationTime: BigInteger, publicationTime?: BigInteger | null): Promise<CalendarHashChain>;
    getPublicationsFile(): Promise<IPublicationsFile>;
}
