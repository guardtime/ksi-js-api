/**
 * Verification Rule for KSI Signature
 */
import { LinkDirection } from '../../Constants';
import { KsiError } from '../../service/KsiError';
import { CalendarHashChain } from '../CalendarHashChain';
import { KsiSignature } from '../KsiSignature';
import { KsiVerificationError } from './KsiVerificationError';
import { VerificationContext } from './VerificationContext';
import { VerificationResultCode } from './VerificationResult';
export class VerificationRule {
    constructor(ruleName = null) {
        this.ruleName = this.constructor.name;
        this.onSuccessRule = null;
        this.onFailureRule = null;
        this.onNaRule = null;
        if (ruleName !== null) {
            if (typeof ruleName !== 'string') {
                throw new KsiError(`Invalid rule name: ${ruleName}`);
            }
            this.ruleName = ruleName;
        }
    }
    static verifyContext(context) {
        if (!(context instanceof VerificationContext)) {
            throw new KsiVerificationError('Invalid context');
        }
    }
    static getSignature(context) {
        VerificationRule.verifyContext(context);
        if (!(context.getSignature() instanceof KsiSignature)) {
            throw new KsiVerificationError('Invalid KSI signature in context: null.');
        }
        return context.getSignature();
    }
    static getCalendarHashChain(signature) {
        const calendarHashChain = signature.getCalendarHashChain();
        if (!(calendarHashChain instanceof CalendarHashChain)) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }
        return calendarHashChain;
    }
    static getCalendarHashChainDeprecatedAlgorithmLink(calendarHashChain) {
        if (!(calendarHashChain instanceof CalendarHashChain)) {
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
    static verifyRule(rule) {
        if (!(rule instanceof VerificationRule)) {
            throw new Error(`Invalid rule: ${rule}`);
        }
    }
    getRuleName() {
        return this.ruleName;
    }
    onSuccess(rule) {
        VerificationRule.verifyRule(rule);
        this.onSuccessRule = rule;
        return this;
    }
    onFailure(rule) {
        VerificationRule.verifyRule(rule);
        this.onFailureRule = rule;
        return this;
    }
    onNa(rule) {
        VerificationRule.verifyRule(rule);
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
