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
import { HashAlgorithm } from '@guardtime/gt-js-common';
import { AGGREGATION_HASH_CHAIN_CONSTANTS } from '../../../Constants';
import { TlvOutputStream } from '../../../parser/TlvOutputStream';
import { compareTypedArray } from '../../../util/Array';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies if all metadata tags in aggregation hash chains are valid.
 */
export class AggregationHashChainMetadataRule extends VerificationRule {
    constructor() {
        super('AggregationHashChainMetadataRule');
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const aggregationHashChains = signature.getAggregationHashChains();
            for (const chain of aggregationHashChains) {
                for (const link of chain.getChainLinks()) {
                    const metadata = link.getMetadata();
                    if (metadata === null) {
                        continue;
                    }
                    const paddingTag = metadata.getPaddingTag();
                    if (paddingTag === null) {
                        const metadataBytes = metadata.getValueBytes();
                        if (metadataBytes.length === 0) {
                            continue;
                        }
                        const hashAlgorithmId = metadataBytes[0];
                        if (HashAlgorithm.isInvalidAlgorithm(hashAlgorithmId)) {
                            continue;
                        }
                        const hashAlgorithm = HashAlgorithm.getById(hashAlgorithmId);
                        if (hashAlgorithm !== null && hashAlgorithm.length === metadataBytes.length - 1) {
                            console.debug(`Metadata without padding may not be trusted. Metadata: ${metadata}.`);
                            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
                        }
                    }
                    else {
                        if (metadata.value.indexOf(paddingTag) !== 0) {
                            console.debug(`Metadata with padding may not be trusted. Padding is not the first element. Metadata: ${metadata}.`);
                            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
                        }
                        if (paddingTag.tlv16BitFlag) {
                            console.debug(`Metadata with padding may not be trusted. Padding is not TLV8. Metadata: ${metadata}.`);
                            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
                        }
                        if (!paddingTag.nonCriticalFlag || !paddingTag.forwardFlag) {
                            // tslint:disable-next-line:max-line-length
                            console.debug(`Metadata with padding may not be trusted. Non-critical and forward flags must be set. Metadata: ${metadata}.`);
                            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
                        }
                        if (!compareTypedArray(paddingTag.getValueBytes(), AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueEven)
                            && !compareTypedArray(paddingTag.getValueBytes(), AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd)) {
                            console.debug(`Metadata with padding may not be trusted. Unknown padding value. Metadata: ${metadata}.`);
                            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
                        }
                        const stream = new TlvOutputStream();
                        stream.writeTag(metadata);
                        if (stream.getData().length % 2 !== 0) {
                            console.debug(`Metadata with padding may not be trusted. Invalid padding value. Metadata: ${metadata}.`);
                            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
                        }
                    }
                }
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}