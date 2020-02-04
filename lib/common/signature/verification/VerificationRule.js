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
import { LinkDirection } from '../../Constants';
import { KsiVerificationError } from './KsiVerificationError';
import { VerificationResultCode } from './VerificationResult';
/**
 * Verification Rule for KSI Signature
 */
export class VerificationRule {
    constructor(ruleName) {
        this.onSuccessRule = null;
        this.onFailureRule = null;
        this.onNaRule = null;
        this.ruleName = ruleName;
    }
    static getSignature(context) {
        if (!context.getSignature()) {
            throw new KsiVerificationError('Invalid KSI signature in context: null.');
        }
        return context.getSignature();
    }
    static getCalendarHashChain(signature) {
        const calendarHashChain = signature.getCalendarHashChain();
        if (!calendarHashChain) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }
        return calendarHashChain;
    }
    static getCalendarHashChainDeprecatedAlgorithmLink(calendarHashChain) {
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
    getRuleName() {
        return this.ruleName;
    }
    onSuccess(rule) {
        this.onSuccessRule = rule;
        return this;
    }
    onFailure(rule) {
        this.onFailureRule = rule;
        return this;
    }
    onNa(rule) {
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
