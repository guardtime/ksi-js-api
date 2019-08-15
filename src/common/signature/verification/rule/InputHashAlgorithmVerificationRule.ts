import {DataHash} from '@guardtime/gt-js-common';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * This rule verifies input hash algorithm. If RFC3161 record is present then intput hash algorithm must equal
 * to RFC3161 record input hash algorithm. Otherwise input hash algorithm is compared to aggregation hash chain input hash algorithm.
 * If input hash is not provided then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class InputHashAlgorithmVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const documentHash: DataHash | null = context.getDocumentHash();

        if (documentHash === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const inputHash: DataHash = signature.getInputHash();

        if (documentHash.hashAlgorithm !== inputHash.hashAlgorithm) {
            console.debug(`Wrong input hash algorithm. Expected ${documentHash.hashAlgorithm}, found ${inputHash.hashAlgorithm}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_04());
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
