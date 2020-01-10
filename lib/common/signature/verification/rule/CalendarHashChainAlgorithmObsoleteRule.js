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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LinkDirection } from '../../../Constants';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verifies that calendar hash chain right link hash algorithms were not obsolete at the publication time.
 * If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainAlgorithmObsoleteRule extends VerificationRule {
    constructor() {
        super('CalendarHashChainAlgorithmObsoleteRule');
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarHashChain = signature.getCalendarHashChain();
            if (calendarHashChain === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            for (const link of calendarHashChain.getChainLinks()) {
                if (link.id !== LinkDirection.Left) {
                    continue;
                }
                if (link.getValue().hashAlgorithm.isObsolete(calendarHashChain.getPublicationTime().valueOf())) {
                    // tslint:disable-next-line:max-line-length
                    console.debug(`Calendar hash chain contains obsolete aggregation algorithm at publication time. Algorithm: ${link.getValue().hashAlgorithm.name}; Publication time: ${calendarHashChain.getPublicationTime()}.`);
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_16());
                }
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
