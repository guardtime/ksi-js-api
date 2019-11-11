import { LinkDirection } from '../../Constants';
import { KsiVerificationError } from './KsiVerificationError';
import { VerificationResultCode } from './VerificationResult';
/**
 * Verification Rule for KSI Signature
 */
export class VerificationRule {
    constructor(ruleName) {
        this.onSuccessRule = null;
        this.onFailureRule = null;
        this.onNaRule = null;
        this.ruleName = ruleName;
    }
    static getSignature(context) {
        if (!context.getSignature()) {
            throw new KsiVerificationError('Invalid KSI signature in context: null.');
        }
        return context.getSignature();
    }
    static getCalendarHashChain(signature) {
        const calendarHashChain = signature.getCalendarHashChain();
        if (!calendarHashChain) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }
        return calendarHashChain;
    }
    static getCalendarHashChainDeprecatedAlgorithmLink(calendarHashChain) {
        if (!calendarHashChain) {
            throw new KsiVerificationError('Invalid calendar hash chain.');
        }
        for (const link of calendarHashChain.getChainLinks()) {
            if (link.id !== LinkDirection.Left) {
                continue;
            }
            if (link.getValue().hashAlgorithm.isDeprecated(calendarHashChain.getPublicationTime().valueOf())) {
                return link;
            }
        }
        return null;
    }
    getRuleName() {
        return this.ruleName;
    }
    onSuccess(rule) {
        this.onSuccessRule = rule;
        return this;
    }
    onFailure(rule) {
        this.onFailureRule = rule;
        return this;
    }
    onNa(rule) {
        this.onNaRule = rule;
        return this;
    }
    getNextRule(resultCode) {
        switch (resultCode) {
            case VerificationResultCode.OK:
                return this.onSuccessRule;
            case VerificationResultCode.FAIL:
                return this.onFailureRule;
            case VerificationResultCode.NA:
                return this.onNaRule;
            default:
                return null;
        }
    }
}
