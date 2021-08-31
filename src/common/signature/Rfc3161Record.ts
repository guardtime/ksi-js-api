/*
 * Copyright 2013-2020 Guardtime, Inc.
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

import { DataHash, DataHasher, HashAlgorithm } from '@guardtime/common';
import { BigInteger } from 'big-integer';
import { RFC_3161_RECORD_CONSTANTS } from '../Constants.js';
import { CompositeTag } from '../parser/CompositeTag.js';
import { ImprintTag } from '../parser/ImprintTag.js';
import { IntegerTag } from '../parser/IntegerTag.js';
import { RawTag } from '../parser/RawTag.js';
import { TlvError } from '../parser/TlvError.js';
import { TlvTag } from '../parser/TlvTag.js';

/**
 * RFC 3161 record TLV object.
 */
export class Rfc3161Record extends CompositeTag {
  private aggregationTime: IntegerTag;
  private chainIndexes: IntegerTag[] = [];
  private inputHash: ImprintTag;
  private tstInfoPrefix: RawTag;
  private tstInfoSuffix: RawTag;
  private tstInfoAlgorithm: HashAlgorithm;
  private signedAttributesPrefix: RawTag;
  private signedAttributesSuffix: RawTag;
  private signedAttributesAlgorithm: HashAlgorithm;

  /**
   * RFC 3161 record TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get input hash.
   * @returns Input hash.
   */
  public getInputHash(): DataHash {
    return this.inputHash.getValue();
  }

  /**
   * Get TST info hash algorithm.
   * @returns TST info hash algorithm.
   */
  public getTstInfoAlgorithm(): HashAlgorithm {
    return this.tstInfoAlgorithm;
  }

  /**
   * Get signed attributes hash algorithm.
   * @returns Signed attributes hash algorithm.
   */
  public getSignedAttributesAlgorithm(): HashAlgorithm {
    return this.signedAttributesAlgorithm;
  }

  /**
   * Get aggregation time.
   * @returns Aggregation time.
   */
  public getAggregationTime(): BigInteger {
    return this.aggregationTime.getValue();
  }

  /**
   * Get chain index values.
   * @returns Chain indexes.
   */
  public getChainIndex(): BigInteger[] {
    const result: BigInteger[] = [];
    for (const tag of this.chainIndexes) {
      result.push(tag.getValue());
    }

    return result;
  }

  /**
   * Calculate output hash.
   * @returns Output hash.
   */
  public async getOutputHash(): Promise<DataHash> {
    let hasher: DataHasher = new DataHasher(this.tstInfoAlgorithm);
    hasher.update(this.tstInfoPrefix.getValue());
    hasher.update(this.inputHash.getValue().value);
    hasher.update(this.tstInfoSuffix.getValue());

    const inputHash: DataHash = await hasher.digest();

    hasher = new DataHasher(this.signedAttributesAlgorithm);
    hasher.update(this.signedAttributesPrefix.getValue());
    hasher.update(inputHash.value);
    hasher.update(this.signedAttributesSuffix.getValue());

    return hasher.digest();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case RFC_3161_RECORD_CONSTANTS.AggregationTimeTagType:
        return (this.aggregationTime = new IntegerTag(tlvTag));
      case RFC_3161_RECORD_CONSTANTS.ChainIndexTagType:
        const chainIndexTag: IntegerTag = new IntegerTag(tlvTag);
        this.chainIndexes.push(chainIndexTag);

        return chainIndexTag;
      case RFC_3161_RECORD_CONSTANTS.InputHashTagType:
        return (this.inputHash = new ImprintTag(tlvTag));
      case RFC_3161_RECORD_CONSTANTS.TstInfoPrefixTagType:
        return (this.tstInfoPrefix = new RawTag(tlvTag));
      case RFC_3161_RECORD_CONSTANTS.TstInfoSuffixTagType:
        return (this.tstInfoSuffix = new RawTag(tlvTag));
      case RFC_3161_RECORD_CONSTANTS.TstInfoAlgorithmTagType:
        // TODO: Better solution
        const tstInfoAlgorithmTag: IntegerTag = new IntegerTag(tlvTag);
        const tstInfoAlgorithm: HashAlgorithm | null = HashAlgorithm.getById(tstInfoAlgorithmTag.getValue().valueOf());
        if (tstInfoAlgorithm === null) {
          throw new Error(`Invalid algorithm: ${tstInfoAlgorithmTag.getValue()}.`);
        }

        this.tstInfoAlgorithm = tstInfoAlgorithm;

        return tstInfoAlgorithmTag;
      case RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType:
        return (this.signedAttributesPrefix = new RawTag(tlvTag));
      case RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType:
        return (this.signedAttributesSuffix = new RawTag(tlvTag));
      case RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType:
        const signedAttributesAlgorithmTag: IntegerTag = new IntegerTag(tlvTag);
        const signedAttributesAlgorithm: HashAlgorithm | null = HashAlgorithm.getById(
          signedAttributesAlgorithmTag.getValue().valueOf()
        );

        if (signedAttributesAlgorithm === null) {
          throw new Error(`Invalid algorithm: ${signedAttributesAlgorithmTag.getValue()}.`);
        }

        this.signedAttributesAlgorithm = signedAttributesAlgorithm;

        return signedAttributesAlgorithmTag;
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(RFC_3161_RECORD_CONSTANTS.AggregationTimeTagType) !== 1) {
      throw new TlvError('Exactly one aggregation time must exist in RFC#3161 record.');
    }

    if (this.chainIndexes.length === 0) {
      throw new TlvError('Chain indexes must exist in RFC#3161 record.');
    }

    if (this.getCount(RFC_3161_RECORD_CONSTANTS.InputHashTagType) !== 1) {
      throw new TlvError('Exactly one input hash must exist in RFC#3161 record.');
    }

    if (this.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoPrefixTagType) !== 1) {
      throw new TlvError('Exactly one tstInfo prefix must exist in RFC#3161 record.');
    }

    if (this.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoSuffixTagType) !== 1) {
      throw new TlvError('Exactly one tstInfo suffix must exist in RFC#3161 record.');
    }

    if (this.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoAlgorithmTagType) !== 1) {
      throw new TlvError('Exactly one tstInfo algorithm must exist in RFC#3161 record.');
    }

    if (this.tstInfoAlgorithm === null) {
      throw new TlvError('Invalid tstInfo algorithm value in RFC#3161 record.');
    }

    if (this.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType) !== 1) {
      throw new TlvError('Exactly one signed attributes prefix must exist in RFC#3161 record.');
    }

    if (this.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType) !== 1) {
      throw new TlvError('Exactly one signed attributes suffix must exist in RFC#3161 record.');
    }

    if (this.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType) !== 1) {
      throw new TlvError('Exactly one signed attributes algorithm must exist in RFC#3161 record.');
    }

    if (this.signedAttributesAlgorithm === null) {
      throw new TlvError('Invalid signed attributes algorithm value in RFC#3161 record.');
    }
  }
}
