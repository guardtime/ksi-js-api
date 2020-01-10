import { ImprintTag } from '../../parser/ImprintTag';
import { CalendarHashChain } from '../CalendarHashChain';
import { KsiSignature } from '../KsiSignature';
import { VerificationContext } from './VerificationContext';
import { VerificationResult, VerificationResultCode } from './VerificationResult';
/**
 * Verification Rule for KSI Signature
 */
export declare abstract class VerificationRule {
    private onSuccessRule;
    private onFailureRule;
    private onNaRule;
    private readonly ruleName;
    protected constructor(ruleName: string);
    protected static getSignature(context: VerificationContext): KsiSignature;
    protected static getCalendarHashChain(signature: KsiSignature): CalendarHashChain;
    protected static getCalendarHashChainDeprecatedAlgorithmLink(calendarHashChain: CalendarHashChain): ImprintTag | null;
    getRuleName(): string;
    onSuccess(rule: VerificationRule): VerificationRule;
    onFailure(rule: VerificationRule): VerificationRule;
    onNa(rule: VerificationRule): VerificationRule;
    abstract verify(context: VerificationContext): Promise<VerificationResult>;
    getNextRule(resultCode: VerificationResultCode): VerificationRule | null;
}
