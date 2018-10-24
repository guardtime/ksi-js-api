export var VerificationResultCode;
(function (VerificationResultCode) {
    VerificationResultCode[VerificationResultCode["OK"] = 0] = "OK";
    VerificationResultCode[VerificationResultCode["FAIL"] = 1] = "FAIL";
    VerificationResultCode[VerificationResultCode["NA"] = 2] = "NA";
})(VerificationResultCode || (VerificationResultCode = {}));
export class VerificationResult {
    constructor(ruleName, resultCode, verificationError = null, childResults = null) {
        this.childResults = [];
        this.ruleName = ruleName;
        this.resultCode = resultCode;
        this.verificationError = verificationError || null;
        if (Array.isArray(childResults)) {
            childResults.forEach((result) => {
                if (!(result instanceof VerificationResult)) {
                    throw new Error('Invalid verification result.');
                }
                this.childResults.push(result);
            });
        }
    }
    static CREATE_FROM_RESULTS(ruleName, childResults) {
        if (!Array.isArray(childResults) || childResults.length === 0) {
            throw new Error('Invalid child results.');
        }
        const lastResult = childResults[childResults.length - 1];
        if (!(lastResult instanceof VerificationResult)) {
            throw new Error('Invalid verification result.');
        }
        return new VerificationResult(ruleName, lastResult.resultCode, lastResult.verificationError, childResults);
    }
    getResultCode() {
        return this.resultCode;
    }
    getVerificationError() {
        return this.verificationError;
    }
    getRuleName() {
        return this.ruleName;
    }
}
