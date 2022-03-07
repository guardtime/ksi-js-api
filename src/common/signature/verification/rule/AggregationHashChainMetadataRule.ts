/*
 * Copyright 2013-2022 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import { ResultCode as VerificationResultCode, HashAlgorithm, Array } from '@guardtime/common';
import { AGGREGATION_HASH_CHAIN_CONSTANTS } from '../../../Constants.js';
import { RawTag } from '../../../parser/RawTag.js';
import { TlvOutputStream } from '../../../parser/TlvOutputStream.js';
import { AggregationHashChain, AggregationHashChainLinkMetaData } from '../../AggregationHashChain.js';
import { KsiSignature } from '../../KsiSignature.js';
import { VerificationContext } from '../VerificationContext.js';
import { VerificationError } from '../VerificationError.js';
import { VerificationResult } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

/**
 * Rule verifies if all metadata tags in aggregation hash chains are valid.
 */
export class AggregationHashChainMetadataRule extends VerificationRule {
  public constructor() {
    super('AggregationHashChainMetadataRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

    for (const chain of aggregationHashChains) {
      for (const link of chain.getChainLinks()) {
        const metadata: AggregationHashChainLinkMetaData | null = link.getMetadata();

        if (metadata === null) {
          continue;
        }

        const paddingTag: RawTag | null = metadata.getPaddingTag();
        if (paddingTag === null) {
          const metadataBytes: Uint8Array = metadata.getValueBytes();
          if (metadataBytes.length === 0) {
            continue;
          }

          const hashAlgorithmId: number = metadataBytes[0];
          if (HashAlgorithm.isInvalidAlgorithm(hashAlgorithmId)) {
            continue;
          }

          const hashAlgorithm: HashAlgorithm | null = HashAlgorithm.getById(hashAlgorithmId);
          if (hashAlgorithm !== null && hashAlgorithm.length === metadataBytes.length - 1) {
            console.debug(`Metadata without padding may not be trusted. Metadata: ${metadata}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
          }
        } else {
          if (metadata.value.indexOf(paddingTag) !== 0) {
            console.debug(
              `Metadata with padding may not be trusted. Padding is not the first element. Metadata: ${metadata}.`
            );

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
          }

          if (paddingTag.tlv16BitFlag) {
            console.debug(`Metadata with padding may not be trusted. Padding is not TLV8. Metadata: ${metadata}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
          }

          if (!paddingTag.nonCriticalFlag || !paddingTag.forwardFlag) {
            console.debug(
              `Metadata with padding may not be trusted. Non-critical and forward flags must be set. Metadata: ${metadata}.`
            );

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
          }

          if (
            !Array.compareUint8Arrays(
              paddingTag.getValueBytes(),
              AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueEven
            ) &&
            !Array.compareUint8Arrays(
              paddingTag.getValueBytes(),
              AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd
            )
          ) {
            console.debug(`Metadata with padding may not be trusted. Unknown padding value. Metadata: ${metadata}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
          }

          const stream: TlvOutputStream = new TlvOutputStream();
          stream.writeTag(metadata);
          if (stream.getData().length % 2 !== 0) {
            console.debug(`Metadata with padding may not be trusted. Invalid padding value. Metadata: ${metadata}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11());
          }
        }
      }
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
