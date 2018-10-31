/**
 * Verification result for KSI signature
 */
import { VerificationError } from './VerificationError';
export declare enum VerificationResultCode {
    OK = 0,
    FAIL = 1,
    NA = 2
}
export declare class VerificationResult {
    private readonly ruleName;
    private readonly childResults;
    private readonly verificationError;
    private readonly resultCode;
    constructor(ruleName: string, resultCode: VerificationResultCode, verificationError?: VerificationError | null, childResults?: VerificationResult[] | null);
    static CREATE_FROM_RESULTS(ruleName: string, childResults: VerificationResult[]): VerificationResult;
    getResultCode(): VerificationResultCode;
    getVerificationError(): VerificationError | null;
    getRuleName(): string;
}
