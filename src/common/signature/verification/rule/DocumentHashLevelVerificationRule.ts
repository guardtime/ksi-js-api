import bigInteger from 'big-integer';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * This rule verifies that given document hash level is not greater than the first link level
 * correction of the first aggregation hash chain. In case RFC3161 signature the given document hash level must be 0.
 * If the level is equal to or less than expected then VerificationResultCode.Ok is returned.
 */
export class DocumentHashLevelVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const levelCorrection: bigInteger.BigInteger = signature.getRfc3161Record() !== null
            ? bigInteger(0)
            : signature.getAggregationHashChains()[0].getChainLinks()[0].getLevelCorrection();

        return context.getDocumentHashLevel() > levelCorrection
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_03())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
