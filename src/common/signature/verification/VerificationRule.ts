import {LinkDirection} from '../../Constants';
import {ImprintTag} from '../../parser/ImprintTag';
import {CalendarHashChain} from '../CalendarHashChain';
import {KsiSignature} from '../KsiSignature';
import {KsiVerificationError} from './KsiVerificationError';
import {VerificationContext} from './VerificationContext';
import {VerificationResult, VerificationResultCode} from './VerificationResult';

/**
 * Verification Rule for KSI Signature
 */
export abstract class VerificationRule {
    private onSuccessRule: VerificationRule | null = null;
    private onFailureRule: VerificationRule | null = null;
    private onNaRule: VerificationRule | null = null;
    private readonly ruleName: string;

    protected constructor(ruleName: string) {
        this.ruleName = ruleName;
    }

    protected static getSignature(context: VerificationContext): KsiSignature {
        if (!context.getSignature()) {
            throw new KsiVerificationError('Invalid KSI signature in context: null.');
        }

        return context.getSignature();
    }

    protected static getCalendarHashChain(signature: KsiSignature): CalendarHashChain {
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (!calendarHashChain) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }

        return calendarHashChain;
    }

    protected static getCalendarHashChainDeprecatedAlgorithmLink(calendarHashChain: CalendarHashChain): ImprintTag | null {
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

    public getRuleName(): string {
        return this.ruleName;
    }

    public onSuccess(rule: VerificationRule): VerificationRule {
        this.onSuccessRule = rule;

        return this;
    }

    public onFailure(rule: VerificationRule): VerificationRule {
        this.onFailureRule = rule;

        return this;
    }

    public onNa(rule: VerificationRule): VerificationRule {
        this.onNaRule = rule;

        return this;
    }

    public abstract async verify(context: VerificationContext): Promise<VerificationResult>;

    public getNextRule(resultCode: VerificationResultCode): VerificationRule | null {
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
