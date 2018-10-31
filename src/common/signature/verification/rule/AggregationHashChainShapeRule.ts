import {BigInteger} from 'big-integer';
import {AggregationHashChain} from '../../AggregationHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that shape of the aggregation hash chain matches with chain index.
 */
export class AggregationHashChainShapeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        for (const chain of aggregationHashChains) {
            const chainIndex: BigInteger[] = chain.getChainIndex();
            const calculatedValue: BigInteger = chain.calculateLocationPointer();
            const lastIndexValue: BigInteger = chainIndex[chainIndex.length - 1];

            if (!lastIndexValue.eq(calculatedValue)) {
                // tslint:disable-next-line:max-line-length
                console.warn(`The shape of the aggregation hash chain does not match with the chain index. Calculated location pointer: ${calculatedValue}; Value in chain: ${lastIndexValue}`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_10);
            }

        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
