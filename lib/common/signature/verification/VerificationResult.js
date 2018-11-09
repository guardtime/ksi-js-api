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
        if (childResults !== null) {
            this.childResults = childResults.slice();
        }
    }
    static CREATE_FROM_RESULTS(ruleName, childResults) {
        const lastResult = childResults.length > 0
            ? childResults[childResults.length - 1]
            : new VerificationResult(ruleName, VerificationResultCode.OK);
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
    getChildResults() {
        return this.childResults.slice();
    }
}
