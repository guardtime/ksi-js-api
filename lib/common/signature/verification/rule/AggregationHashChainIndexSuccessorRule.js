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
import { compareArrayEquals } from '../../../util/Array';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule checks that chain index of a aggregation hash chain is successor to it's parent aggregation hash chain index.
 */
export class AggregationHashChainIndexSuccessorRule extends VerificationRule {
    constructor() {
        super('AggregationHashChainIndexSuccessorRule');
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const aggregationHashChains = signature.getAggregationHashChains();
            let parentChainIndex = null;
            for (const chain of aggregationHashChains) {
                const chainIndex = chain.getChainIndex();
                if (parentChainIndex !== null && (parentChainIndex.length <= chainIndex.length
                    || !compareArrayEquals(parentChainIndex.slice(0, chainIndex.length), chainIndex))) {
                    // tslint:disable-next-line:max-line-length
                    console.debug(`Chain index is not the successor to the parent aggregation hash chain index. Chain index: ${chainIndex}; Parent chain index: ${parentChainIndex}.`);
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12());
                }
                parentChainIndex = chainIndex;
            }
            if (aggregationHashChains[aggregationHashChains.length - 1].getChainIndex().length !== 1) {
                // tslint:disable-next-line:max-line-length
                console.debug(`Highest aggregation hash chain index length is not 1. Chain index: ${aggregationHashChains[aggregationHashChains.length - 1].getChainIndex()}.`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12());
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
