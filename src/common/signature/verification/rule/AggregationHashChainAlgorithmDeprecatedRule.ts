import {AggregationHashChain} from '../../AggregationHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verifies that aggregation hash chains use hash algorithms that were not deprecated at the aggregation time.
 */
export class AggregationHashChainAlgorithmDeprecatedRule extends VerificationRule {
    constructor() {
        super("AggregationHashChainAlgorithmDeprecatedRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        for (const chain of aggregationHashChains) {
            if (chain.getAggregationAlgorithm().isDeprecated(chain.getAggregationTime().valueOf())) {
                // tslint:disable-next-line:max-line-length
                console.debug(`Aggregation hash chain aggregation algorithm was deprecated at aggregation time. Algorithm: ${chain.getAggregationAlgorithm().name}; Aggregation time: ${chain.getAggregationTime()}.s`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_15());
            }
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
