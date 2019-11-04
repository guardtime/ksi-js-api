import {KsiSignature} from '../../KsiSignature';
import {Rfc3161Record} from '../../Rfc3161Record';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verifies that all hash algorithms used internally in RFC3161 record were not deprecated at the aggregation time.
 * If RFC3161 record is not present then VerificationResultCode.Ok is returned.
 */
export class Rfc3161RecordHashAlgorithmDeprecatedRule extends VerificationRule {
    constructor() {
        super("Rfc3161RecordHashAlgorithmDeprecatedRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (rfc3161Record === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        if (rfc3161Record.getTstInfoAlgorithm() != null
            && rfc3161Record.getTstInfoAlgorithm().isDeprecated(rfc3161Record.getAggregationTime().valueOf())) {

            // tslint:disable-next-line:max-line-length
            console.debug(`Hash algorithm used to hash the TSTInfo structure was deprecated at aggregation time. Algorithm: ${rfc3161Record.getTstInfoAlgorithm().name}; Aggregation time: ${rfc3161Record.getAggregationTime()}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_14());
        }

        if (rfc3161Record.getSignedAttributesAlgorithm() != null
            && rfc3161Record.getSignedAttributesAlgorithm().isDeprecated(rfc3161Record.getAggregationTime().valueOf())) {

            // tslint:disable-next-line:max-line-length
            console.debug(`Hash algorithm used to hash the SignedAttributes structure was deprecated at aggregation time. Algorithm: ${rfc3161Record.getSignedAttributesAlgorithm().name}; Aggregation time: ${rfc3161Record.getAggregationTime()}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_14());
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
