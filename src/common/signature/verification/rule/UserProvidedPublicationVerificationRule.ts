import {PublicationData} from '../../../publication/PublicationData';
import {PublicationRecord} from '../../../publication/PublicationRecord';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that user provided publication equals to publication in KSI signature.
 */
export class UserProvidedPublicationVerificationRule extends VerificationRule {
    constructor() {
        super("UserProvidedPublicationVerificationRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const userPublication: PublicationData | null = context.getUserPublication();
        if (userPublication === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('User publication is missing from context.')));
        }

        const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();
        if (publicationRecord === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Publications record is missing from signature.')));
        }

        if (userPublication.getPublicationTime().neq(publicationRecord.getPublicationTime())) {
            // tslint:disable-next-line:max-line-length
            console.debug(`User provided publication time does not equal to signature publication time. User provided publication time: ${userPublication.getPublicationTime()}; Signature publication time: ${publicationRecord.getPublicationTime()}.`);

            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                // tslint:disable-next-line:max-line-length
                VerificationError.GEN_02(new KsiVerificationError('User publication publication time is not equal to signature publication time.')));
        }

        return !userPublication.getPublicationHash().equals(publicationRecord.getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_04())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
