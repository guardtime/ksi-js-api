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

import bigInteger, { BigInteger } from 'big-integer';
import { DataHash } from '@guardtime/common/lib/hash/DataHash.js';
import { DataHasher } from '@guardtime/common/lib/hash/DataHasher.js';
import { HashAlgorithm } from '@guardtime/common/lib/hash/HashAlgorithm.js';

import { CALENDAR_HASH_CHAIN_CONSTANTS, LinkDirection } from '../Constants.js';
import { CompositeTag } from '../parser/CompositeTag.js';
import { ImprintTag } from '../parser/ImprintTag.js';
import { IntegerTag } from '../parser/IntegerTag.js';
import { TlvError } from '../parser/TlvError.js';
import { TlvTag } from '../parser/TlvTag.js';
import { PublicationData } from '../publication/PublicationData.js';

/**
 * Calendar hash chain TLV object.
 */
export class CalendarHashChain extends CompositeTag {
  private chainLinks: ImprintTag[] = [];
  private publicationTime: IntegerTag;
  private aggregationTime: IntegerTag;
  private inputHash: ImprintTag;

  /**
   * Calendar hash chain TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Calculate highest bit.
   * @returns Highest bit.
   */
  private static highBit(n: BigInteger): BigInteger {
    let v: BigInteger = n;
    v = v.or(v.shiftRight(1));
    v = v.or(v.shiftRight(2));
    v = v.or(v.shiftRight(4));
    v = v.or(v.shiftRight(8));
    v = v.or(v.shiftRight(16));
    v = v.or(v.shiftRight(32));

    return v.minus(v.shiftRight(1));
  }

  /**
   * Hash two hashes together with algorithm.
   * @returns Link step hash.
   */
  private static async getStepHash(algorithm: HashAlgorithm, hashA: Uint8Array, hashB: Uint8Array): Promise<DataHash> {
    const hasher: DataHasher = new DataHasher(algorithm);
    hasher.update(hashA);
    hasher.update(hashB);
    hasher.update(new Uint8Array([0xff]));

    return hasher.digest();
  }

  /**
   * Compare right links if they are equal.
   * @returns True if right links are equal.
   */
  public areRightLinksEqual(calendarHashChain: CalendarHashChain): boolean {
    let i = 0;
    let j = 0;
    while (i < this.chainLinks.length || j < calendarHashChain.chainLinks.length) {
      if (this.chainLinks[i].id !== LinkDirection.Right) {
        i += 1;
        continue;
      }

      if (calendarHashChain.chainLinks[j].id !== LinkDirection.Right) {
        j += 1;
        continue;
      }

      if (!this.chainLinks[i].getValue().equals(calendarHashChain.chainLinks[j].getValue())) {
        return false;
      }

      i += 1;
      j += 1;
    }

    return true;
  }

  /**
   * Calculate registration time.
   * @returns Registration time.
   */
  public calculateRegistrationTime(): BigInteger {
    let r: BigInteger = this.publicationTime.getValue();
    let t: BigInteger = bigInteger(0);

    // iterate over the chain in reverse
    for (let i: number = this.chainLinks.length - 1; i >= 0; i -= 1) {
      if (r.leq(0)) {
        console.warn('Invalid calendar hash chain shape for publication time. Cannot calculate registration time.');

        return bigInteger(0);
      }

      if (this.chainLinks[i].id === LinkDirection.Left) {
        r = CalendarHashChain.highBit(r).minus(1);
      } else {
        t = t.plus(CalendarHashChain.highBit(r));
        r = r.minus(CalendarHashChain.highBit(r));
      }
    }

    if (r.neq(0)) {
      console.warn('Calendar hash chain shape inconsistent with publication time. Cannot calculate registration time.');

      return bigInteger(0);
    }

    return t;
  }

  /**
   * Get calendar hash chain links.
   * @returns Chain links.
   */
  public getChainLinks(): ImprintTag[] {
    return this.chainLinks;
  }

  /**
   * Get publications time.
   * @returns Publications time.
   */
  public getPublicationTime(): bigInteger.BigInteger {
    return this.publicationTime.getValue();
  }

  /**
   * Get chain input hash.
   * @returns Chain input hash.
   */
  public getInputHash(): DataHash {
    return this.inputHash.getValue();
  }

  /**
   * Get aggregation time if exists, otherwise publications time.
   * @returns Aggregation time.
   */
  public getAggregationTime(): bigInteger.BigInteger {
    return this.aggregationTime ? this.aggregationTime.getValue() : this.getPublicationTime();
  }

  /**
   * Calculate chain output hash.
   * @returns Links output hash
   */
  public async calculateOutputHash(): Promise<DataHash> {
    let inputHash: DataHash = this.getInputHash();
    for (const link of this.getChainLinks()) {
      const siblingHash: DataHash = link.getValue();

      if (link.id === LinkDirection.Left) {
        inputHash = await CalendarHashChain.getStepHash(
          siblingHash.hashAlgorithm,
          inputHash.imprint,
          siblingHash.imprint,
        );
      }

      if (link.id === LinkDirection.Right) {
        inputHash = await CalendarHashChain.getStepHash(
          inputHash.hashAlgorithm,
          siblingHash.imprint,
          inputHash.imprint,
        );
      }
    }

    return inputHash;
  }

  /**
   * Get publications data.
   * @returns Publications data.
   */
  public async getPublicationData(): Promise<PublicationData> {
    return PublicationData.CREATE(this.publicationTime.getValue(), await this.calculateOutputHash());
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType:
        return (this.publicationTime = new IntegerTag(tlvTag));
      case CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
        return (this.aggregationTime = new IntegerTag(tlvTag));
      case CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType:
        return (this.inputHash = new ImprintTag(tlvTag));
      case LinkDirection.Left:
      case LinkDirection.Right:
        const link: ImprintTag = new ImprintTag(tlvTag);
        this.chainLinks.push(link);

        return link;
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType) !== 1) {
      throw new TlvError('Exactly one publication time must exist in calendar hash chain.');
    }

    if (this.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType) > 1) {
      throw new TlvError('Only one aggregation time is allowed in calendar hash chain.');
    }

    if (this.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType) !== 1) {
      throw new TlvError('Exactly one input hash must exist in calendar hash chain.');
    }

    if (this.chainLinks.length === 0) {
      throw new TlvError('Links are missing in calendar hash chain.');
    }
  }
}
