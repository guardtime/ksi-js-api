import bigInteger from 'big-integer';
import {AggregationHashChain, AggregationHashResult} from '../../AggregationHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule verifies if all aggregation hash chains are consistent. e.g. previous aggregation hash chain output hash
 * equals to current aggregation hash chain input hash.
 */
export class AggregationHashChainConsistencyRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        let chainHashResult: AggregationHashResult | null = null;
        for (const chain of aggregationHashChains) {
            if (chainHashResult === null) {
                chainHashResult = {level: bigInteger(0), hash: chain.getInputHash()};
            }

            if (!chain.getInputHash().equals(chainHashResult.hash)) {
                // tslint:disable-next-line:max-line-length
                console.debug(`Aggregation hash chains not consistent. Aggregation hash chain input hash ${chain.getInputHash()} does not match previous aggregation hash chain output hash ${chainHashResult.hash}.`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01());
            }

            chainHashResult = await chain.getOutputHash(chainHashResult);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
