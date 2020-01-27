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
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Extended signature calendar hash chain input hash rule
 */
export class ExtendedSignatureCalendarChainInputHashRule extends VerificationRule {
    constructor() {
        super('ExtendedSignatureCalendarChainInputHashRule');
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarHashChain = signature.getCalendarHashChain();
            let extendedCalendarHashChain = null;
            try {
                extendedCalendarHashChain = calendarHashChain == null
                    ? yield context.getExtendedLatestCalendarHashChain()
                    : yield context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());
            }
            catch (e) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
            }
            const lastAggregationHashChainRootHash = yield signature.getLastAggregationHashChainRootHash();
            return !lastAggregationHashChainRootHash.equals(extendedCalendarHashChain.getInputHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_02())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
