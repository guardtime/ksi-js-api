import bigInteger, {BigInteger} from 'big-integer';
import {DataHash} from 'gt-js-common';
import {PublicationsFile} from '../publication/PublicationsFile';
import {CalendarHashChain} from '../signature/CalendarHashChain';
import {KsiSignature} from '../signature/KsiSignature';
import {ExtendingService} from './ExtendingService';
import {KsiServiceError} from './KsiServiceError';
import {PublicationsFileService} from './PublicationsFileService';
import {SigningService} from './SigningService';

/**
 * KSI service.
 */
export class KsiService {
    private readonly signingService: SigningService | null;
    private readonly extendingService: ExtendingService | null;
    private readonly publicationsFileService: PublicationsFileService | null;

    constructor(signingService: SigningService | null = null, extendingService: ExtendingService | null = null,
                publicationsFileService: PublicationsFileService | null) {
        this.signingService = signingService;
        this.extendingService = extendingService;
        this.publicationsFileService = publicationsFileService;
    }

    public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<KsiSignature> {
        if (!this.signingService) {
            throw new KsiServiceError('Signing protocol not defined. Cannot use signing.');
        }

        return this.signingService.sign(hash, level);
    }

    public async extend(aggregationTime: BigInteger, publicationTime: BigInteger | null = null): Promise<CalendarHashChain> {
        if (!this.extendingService) {
            throw new KsiServiceError('Extending service not defined. Cannot use extending.');
        }

        return this.extendingService.extend(aggregationTime, publicationTime);
    }

    public async getPublicationsFile(): Promise<PublicationsFile> {
        if (!this.publicationsFileService) {
            throw new KsiServiceError('Publications file service not defined. Cannot get publications file.');
        }

        return this.publicationsFileService.getPublicationsFile();
    }

}
