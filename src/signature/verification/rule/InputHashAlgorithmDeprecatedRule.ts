import {DataHash} from 'gt-js-common';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * This rule verifies that input hash algorithm is not deprecated at aggregation time.
 * If RFC3161 record is present then RFC3161 record input hash algorithm deprecation is checked.
 */
export class InputHashAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const inputHash: DataHash = signature.getInputHash();

        if (inputHash.hashAlgorithm.isDeprecated(signature.getAggregationTime().valueOf())) {
            console.log(`Input hash algorithm was deprecated at aggregation time.
                         Algorithm: ${inputHash.hashAlgorithm.name}; Aggregation time: ${signature.getAggregationTime()}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_13);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
