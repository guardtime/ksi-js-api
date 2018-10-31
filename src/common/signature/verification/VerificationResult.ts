/**
 * Verification result for KSI signature
 */
import {VerificationError} from './VerificationError';

export enum VerificationResultCode {
  OK, FAIL, NA
}

export class VerificationResult {

    private readonly ruleName: string;
    private readonly childResults: VerificationResult[] = [];
    private readonly verificationError: VerificationError | null;
    private readonly resultCode: VerificationResultCode;

    constructor(ruleName: string,
                resultCode: VerificationResultCode,
                verificationError: VerificationError | null = null,
                childResults: VerificationResult[] | null = null) {
        this.ruleName = ruleName;
        this.resultCode = resultCode;
        this.verificationError = verificationError || null;

        if (Array.isArray(childResults)) {
            this.childResults.concat(childResults);
        }
    }

    public static CREATE_FROM_RESULTS(ruleName: string, childResults: VerificationResult[]): VerificationResult {
        const lastResult: VerificationResult = childResults[childResults.length - 1];

        return new VerificationResult(ruleName, lastResult.resultCode, lastResult.verificationError, childResults);
    }

    public getResultCode(): VerificationResultCode {
        return this.resultCode;
    }

    public getVerificationError(): VerificationError | null {
        return this.verificationError;
    }

    public getRuleName(): string {
        return this.ruleName;
    }
}
