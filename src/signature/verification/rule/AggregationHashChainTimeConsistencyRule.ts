import bigInteger from 'big-integer';
import {AggregationHashChain} from '../../AggregationHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that aggregation hash chain times are consistent. It means that previous aggregation hash chain
 * aggregation time equals to current one.
 */
export class AggregationHashChainTimeConsistencyRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        let time: bigInteger.BigInteger | null = null;
        for (const chain of aggregationHashChains) {
            if (time === null) {
                time = chain.getAggregationTime();
            }

            if (!chain.getAggregationTime().equals(time)) {
                console.log(`Previous aggregation hash chain aggregation time ${time} does not match
                             current aggregation time ${chain.getAggregationTime()}.`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_02);
            }

        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
