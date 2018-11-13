import {AggregationHashChain} from '../../AggregationHashChain';
import {KsiSignature} from '../../KsiSignature';
import {Rfc3161Record} from '../../Rfc3161Record';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * This rule verifies that aggregation hash chain aggregation time and RFC3161 record aggregation time match.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class Rfc3161RecordAggregationTimeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (rfc3161Record === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChains: Readonly<AggregationHashChain[]> = signature.getAggregationHashChains();
        if (!aggregationHashChains[0].getAggregationTime().equals(rfc3161Record.getAggregationTime())) {
            console.debug(`Aggregation hash chain aggregation time and RFC 3161 aggregation time mismatch.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_02);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
