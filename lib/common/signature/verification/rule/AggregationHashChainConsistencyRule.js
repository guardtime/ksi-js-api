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
 * Rule verifies if all aggregation hash chains are consistent. e.g. previous aggregation hash chain output hash
 * equals to current aggregation hash chain input hash.
 */
export class AggregationHashChainConsistencyRule extends VerificationRule {
    constructor() {
        super('AggregationHashChainConsistencyRule');
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const aggregationHashChains = signature.getAggregationHashChains();
            let chainHashResult = null;
            for (const chain of aggregationHashChains) {
                if (chainHashResult === null) {
                    chainHashResult = { level: bigInteger(0), hash: chain.getInputHash() };
                }
                if (!chain.getInputHash().equals(chainHashResult.hash)) {
                    // tslint:disable-next-line:max-line-length
                    console.debug(`Aggregation hash chains not consistent. Aggregation hash chain input hash ${chain.getInputHash()} does not match previous aggregation hash chain output hash ${chainHashResult.hash}.`);
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01());
                }
                chainHashResult = yield chain.getOutputHash(chainHashResult);
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}