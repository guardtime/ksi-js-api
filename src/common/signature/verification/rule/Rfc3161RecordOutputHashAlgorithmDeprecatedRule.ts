import {HashAlgorithm} from '@guardtime/gt-js-common';
import {BigInteger} from 'big-integer';
import {AggregationHashChain} from '../../AggregationHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verifies that RFC3161 record output hash algorithm was not deprecated at the aggregation time.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class Rfc3161RecordOutputHashAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();

        if (signature.getRfc3161Record() === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChain: AggregationHashChain = signature.getAggregationHashChains()[0];
        const hashAlgorithm: HashAlgorithm = aggregationHashChain.getInputHash().hashAlgorithm;
        const aggregationTime: BigInteger = aggregationHashChain.getAggregationTime();

        if (hashAlgorithm.isDeprecated(aggregationTime.valueOf())) {
            // tslint:disable-next-line:max-line-length
            console.debug(`RFC3161 output hash algorithm was deprecated at aggregation time. Algorithm: ${hashAlgorithm}; Aggregation time: ${aggregationTime}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_17);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
