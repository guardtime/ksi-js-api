/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */
import { tabPrefix } from '@guardtime/gt-js-common';
export var VerificationResultCode;
(function (VerificationResultCode) {
    VerificationResultCode[VerificationResultCode["OK"] = 0] = "OK";
    VerificationResultCode[VerificationResultCode["FAIL"] = 1] = "FAIL";
    VerificationResultCode[VerificationResultCode["NA"] = 2] = "NA";
})(VerificationResultCode || (VerificationResultCode = {}));
/**
 * Verification result for KSI signature
 */
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
    toString() {
        let result = `VerificationResult ${this.getRuleName()} [${VerificationResultCode[this.getResultCode()]}]`;
        if (this.childResults.length > 0) {
            result += ':\n';
        }
        for (let i = 0; i < this.childResults.length; i += 1) {
            result += tabPrefix(this.childResults[i].toString());
            if (i < (this.childResults.length - 1)) {
                result += '\n';
            }
        }
        return result;
    }
}
