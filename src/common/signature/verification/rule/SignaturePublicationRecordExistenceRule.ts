import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks if KSI signature contains publication record.
 */
export class SignaturePublicationRecordExistenceRule extends VerificationRule {
    constructor() {
        super("SignaturePublicationRecordExistenceRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return context.getSignature().getPublicationRecord() === null
            ? new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Publications record is missing from signature.')))
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
