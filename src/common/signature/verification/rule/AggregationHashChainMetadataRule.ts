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

import { ResultCode as VerificationResultCode } from '@guardtime/common/lib/verification/Result';
import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import { AGGREGATION_HASH_CHAIN_CONSTANTS } from '../../../Constants';
import { RawTag } from '../../../parser/RawTag';
import { TlvOutputStream } from '../../../parser/TlvOutputStream';
import { compareTypedArray } from '../../../util/Array';
import { AggregationHashChain, AggregationHashChainLinkMetaData } from '../../AggregationHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule verifies if all metadata tags in aggregation hash chains are valid.
 */
export class AggregationHashChainMetadataRule extends VerificationRule {
  constructor() {
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
            !compareTypedArray(
              paddingTag.getValueBytes(),
              AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueEven
            ) &&
            !compareTypedArray(
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
