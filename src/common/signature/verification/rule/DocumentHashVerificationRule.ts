import {DataHash} from 'gt-js-common';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * This rule verifies document hash. If RFC3161 record is present then document hash must equal to RFC3161 record input hash.
 * Otherwise document hash is compared to aggregation hash chain input hash.
 * If document hash is not provided then VerificationResultCode.Ok is returned.
 */
export class DocumentHashVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const documentHash: DataHash | null = context.getDocumentHash();

        if (documentHash === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const inputHash: DataHash = signature.getInputHash();
        if (!documentHash.equals(inputHash)) {
            console.warn(`Invalid document hash. Expected ${documentHash}, found ${inputHash}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_01);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
