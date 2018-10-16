/**
 * Verification result for KSI signature
 */
import {VerificationError} from './VerificationError';

export enum VerificationResultCode {
  OK, FAIL, NA
}

export class VerificationResult {

    private readonly ruleName: string;
    private childResults: VerificationResult[] = [];
    private verificationError: VerificationError | null;
    private resultCode: VerificationResultCode;

    constructor(ruleName: string,
                resultCode: VerificationResultCode,
                verificationError: VerificationError | null = null,
                childResults: VerificationResult[] | null = null) {
        this.ruleName = ruleName;
        this.resultCode = resultCode;
        this.verificationError = verificationError || null;

        if (Array.isArray(childResults)) {
            childResults.forEach((result: VerificationResult) => {
                if (!(result instanceof VerificationResult)) {
                    throw new Error('Invalid verification result.');
                }

                this.childResults.push(result);
            });
        }
    }

    public static CREATE_FROM_RESULTS(ruleName: string, childResults: VerificationResult[]): VerificationResult {
        if (!Array.isArray(childResults) || childResults.length > 0) {
            throw new Error('Invalid Child results.');
        }

        const lastResult: VerificationResult = childResults[childResults.length - 1];
        if (!(lastResult instanceof VerificationResult)) {
            throw new Error('Invalid verification result.');
        }

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
