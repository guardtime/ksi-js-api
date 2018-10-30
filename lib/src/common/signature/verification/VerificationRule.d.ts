import { ImprintTag } from '../../parser/ImprintTag';
import { CalendarHashChain } from '../CalendarHashChain';
import { IKsiSignature } from '../IKsiSignature';
import { KsiSignature } from '../KsiSignature';
import { VerificationContext } from './VerificationContext';
import { VerificationResult, VerificationResultCode } from './VerificationResult';
export declare abstract class VerificationRule {
    private readonly ruleName;
    private onSuccessRule;
    private onFailureRule;
    private onNaRule;
    protected constructor(ruleName?: string | null);
    protected static verifyContext(context: VerificationContext): void;
    protected static getSignature(context: VerificationContext): IKsiSignature;
    protected static getCalendarHashChain(signature: KsiSignature): CalendarHashChain;
    protected static getCalendarHashChainDeprecatedAlgorithmLink(calendarHashChain: CalendarHashChain): ImprintTag | null;
    protected static verifyRule(rule: VerificationRule): void;
    getRuleName(): string;
    onSuccess(rule: VerificationRule): VerificationRule;
    onFailure(rule: VerificationRule): VerificationRule;
    onNa(rule: VerificationRule): VerificationRule;
    abstract verify(context: VerificationContext): Promise<VerificationResult>;
    getNextRule(resultCode: VerificationResultCode): VerificationRule | null;
}
