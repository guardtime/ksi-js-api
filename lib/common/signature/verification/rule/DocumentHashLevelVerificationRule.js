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
import bigInteger from 'big-integer';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies that given document hash level is not greater than the first link level
 * correction of the first aggregation hash chain. In case RFC3161 signature the given document hash level must be 0.
 * If the level is equal to or less than expected then VerificationResultCode.Ok is returned.
 */
export class DocumentHashLevelVerificationRule extends VerificationRule {
    constructor() {
        super('DocumentHashLevelVerificationRule');
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const levelCorrection = signature.getRfc3161Record() !== null
                ? bigInteger(0)
                : signature.getAggregationHashChains()[0].getChainLinks()[0].getLevelCorrection();
            return context.getDocumentHashLevel() > levelCorrection
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_03())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
