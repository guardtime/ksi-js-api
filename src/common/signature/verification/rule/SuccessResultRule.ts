import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule that always returns VerificationResultCode.Ok
 */
export class SuccessResultRule extends VerificationRule {
    constructor() {
        super("SuccessResultRule");
    }

    public async verify(): Promise<VerificationResult> {
        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
