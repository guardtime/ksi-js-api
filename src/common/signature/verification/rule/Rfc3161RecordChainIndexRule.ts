import bigInteger from 'big-integer';
import {AggregationHashChain} from '../../AggregationHashChain';
import {KsiSignature} from '../../KsiSignature';
import {Rfc3161Record} from '../../Rfc3161Record';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * This rule verifies that aggregation hash chain index and RFC3161 record chain index match.
 * If RFC3161 record is not present then VerificationResultCode.Ok is returned.
 */
export class Rfc3161RecordChainIndexRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (rfc3161Record === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChains: Readonly<AggregationHashChain[]> = signature.getAggregationHashChains();
        const rfc3161ChainIndex: bigInteger.BigInteger[] = rfc3161Record.getChainIndex();
        const aggregationChainIndex: bigInteger.BigInteger[] = aggregationHashChains[0].getChainIndex();

        const rfc3161ChainIndexJson: string = JSON.stringify(rfc3161ChainIndex);
        const aggregationChainIndexJson: string = JSON.stringify(aggregationChainIndex);
        if (rfc3161ChainIndexJson !== aggregationChainIndexJson) {
            // tslint:disable-next-line:max-line-length
            console.warn(`Aggregation hash chain index and RFC3161 chain index mismatch. Aggregation chain index ${rfc3161ChainIndexJson} and RFC3161 chain index is ${aggregationChainIndexJson}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
