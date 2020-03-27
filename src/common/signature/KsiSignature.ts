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

import Base64Coder from '@guardtime/gt-js-common/lib/coders/Base64Coder';
import UnsignedLongCoder from '@guardtime/gt-js-common/lib/coders/UnsignedLongCoder';
import DataHash from '@guardtime/gt-js-common/lib/hash/DataHash';
import bigInteger, { BigInteger } from 'big-integer';
import { v3 as uuid } from 'uuid';
import {
  AGGREGATION_HASH_CHAIN_CONSTANTS,
  CALENDAR_AUTHENTICATION_RECORD_CONSTANTS,
  CALENDAR_HASH_CHAIN_CONSTANTS,
  KSI_SIGNATURE_CONSTANTS,
  LinkDirection,
  RFC_3161_RECORD_CONSTANTS
} from '../Constants';
import { CompositeTag, ICount } from '../parser/CompositeTag';
import { TlvError } from '../parser/TlvError';
import { TlvInputStream } from '../parser/TlvInputStream';
import { TlvOutputStream } from '../parser/TlvOutputStream';
import { TlvTag } from '../parser/TlvTag';
import { PublicationRecord } from '../publication/PublicationRecord';
import { AggregationResponsePayload } from '../service/AggregationResponsePayload';
import { AggregationHashChain, AggregationHashChainLink, AggregationHashResult } from './AggregationHashChain';
import { CalendarAuthenticationRecord } from './CalendarAuthenticationRecord';
import { CalendarHashChain } from './CalendarHashChain';
import { IKsiIdentity } from './IKsiIdentity';
import { Rfc3161Record } from './Rfc3161Record';

/**
 * KSI Signature TLV object
 */
export class KsiSignature extends CompositeTag {
  private aggregationHashChains: AggregationHashChain[] = [];
  private publicationRecord: PublicationRecord | null = null;
  private calendarAuthenticationRecord: CalendarAuthenticationRecord | null = null;
  private calendarHashChain: CalendarHashChain | null = null;
  private rfc3161Record: Rfc3161Record | null = null;

  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validateValue(this.validate.bind(this));

    this.aggregationHashChains.sort((x: AggregationHashChain, y: AggregationHashChain) => {
      return y.getChainIndex().length - x.getChainIndex().length;
    });

    Object.freeze(this);
  }

  public static CREATE(payload: AggregationResponsePayload): KsiSignature {
    return new KsiSignature(
      CompositeTag.CREATE_FROM_LIST(KSI_SIGNATURE_CONSTANTS.TagType, false, false, payload.getSignatureTags())
    );
  }

  public static CREATE_FROM_BASE64(value: string): KsiSignature {
    return new KsiSignature(new TlvInputStream(Base64Coder.decode(value)).readTag());
  }

  public getPublicationRecord(): PublicationRecord | null {
    return this.publicationRecord;
  }

  public getCalendarHashChain(): CalendarHashChain | null {
    return this.calendarHashChain;
  }

  public getAggregationTime(): BigInteger {
    return this.aggregationHashChains[0].getAggregationTime();
  }

  public getAggregationHashChains(): AggregationHashChain[] {
    return this.aggregationHashChains.slice();
  }

  /**
   * Get last aggregation hash chain output hash that is calculated from all aggregation hash chains
   */
  public async getLastAggregationHashChainRootHash(): Promise<DataHash> {
    let lastResult: AggregationHashResult = {
      level: bigInteger(0),
      hash: this.aggregationHashChains[0].getInputHash()
    };
    for (const chain of this.aggregationHashChains) {
      lastResult = await chain.getOutputHash(lastResult);
    }

    return lastResult.hash;
  }

  public getInputHash(): DataHash {
    return this.rfc3161Record !== null
      ? this.rfc3161Record.getInputHash()
      : this.aggregationHashChains[0].getInputHash();
  }

  public getRfc3161Record(): Rfc3161Record | null {
    return this.rfc3161Record;
  }

  public getCalendarAuthenticationRecord(): CalendarAuthenticationRecord | null {
    return this.calendarAuthenticationRecord;
  }

  public getIdentity(): IKsiIdentity[] {
    const identity: IKsiIdentity[] = [];
    for (let i: number = this.aggregationHashChains.length - 1; i >= 0; i -= 1) {
      identity.push(...this.aggregationHashChains[i].getIdentity());
    }

    return identity;
  }

  public isExtended(): boolean {
    return this.publicationRecord != null;
  }

  public getUuid(): string {
    const valueBytes: number[] = Array.from(UnsignedLongCoder.encodeWithPadding(this.getAggregationTime()));

    const linkBits: number[] = [];
    this.getAggregationHashChains().forEach((chain: AggregationHashChain) => {
      chain.getChainLinks().forEach((link: AggregationHashChainLink) => {
        linkBits.unshift(link.getDirection() === LinkDirection.Left ? 0 : 1);
      });
    });

    linkBits.unshift(1);
    while (linkBits.length % 8 !== 0) {
      linkBits.unshift(0);
    }

    for (let i = 0; i < linkBits.length; i += 8) {
      valueBytes.push(
        (linkBits[i] << 7) +
          (linkBits[i + 1] << 6) +
          (linkBits[i + 2] << 5) +
          (linkBits[i + 3] << 4) +
          (linkBits[i + 4] << 3) +
          (linkBits[i + 5] << 2) +
          (linkBits[i + 6] << 1) +
          linkBits[i + 7]
      );
    }

    return uuid(valueBytes, Array(16));
  }

  public extend(calendarHashChain: CalendarHashChain, publicationRecord: PublicationRecord): KsiSignature {
    const stream: TlvOutputStream = new TlvOutputStream();

    for (const childTag of this.value) {
      switch (childTag.id) {
        case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
        case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
        case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
          break;
        default:
          stream.writeTag(childTag);
      }
    }

    stream.writeTag(calendarHashChain);
    stream.writeTag(
      CompositeTag.createFromCompositeTag(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType, publicationRecord)
    );

    return new KsiSignature(new TlvTag(KSI_SIGNATURE_CONSTANTS.TagType, false, false, stream.getData()));
  }

  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case AGGREGATION_HASH_CHAIN_CONSTANTS.TagType:
        const aggregationHashChain: AggregationHashChain = new AggregationHashChain(tlvTag);
        this.aggregationHashChains.push(aggregationHashChain);

        return aggregationHashChain;
      case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
        return (this.calendarHashChain = new CalendarHashChain(tlvTag));
      case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
        return (this.publicationRecord = new PublicationRecord(tlvTag));
      case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
        return (this.calendarAuthenticationRecord = new CalendarAuthenticationRecord(tlvTag));
      case RFC_3161_RECORD_CONSTANTS.TagType:
        return (this.rfc3161Record = new Rfc3161Record(tlvTag));
      default:
        return CompositeTag.parseTlvTag(tlvTag);
    }
  }

  private validate(tagCount: ICount): void {
    if (this.aggregationHashChains.length === 0) {
      throw new TlvError('Aggregation hash chains must exist in KSI signature.');
    }

    if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.TagType) > 1) {
      throw new TlvError('Only one calendar hash chain is allowed in KSI signature.');
    }

    if (
      tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.TagType) === 0 &&
      (tagCount.getCount(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType) !== 0 ||
        tagCount.getCount(CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType) !== 0)
    ) {
      throw new TlvError(
        'No publication record or calendar authentication record is ' +
          'allowed in KSI signature if there is no calendar hash chain.'
      );
    }

    if (
      (tagCount.getCount(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType) === 1 &&
        tagCount.getCount(CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType) === 1) ||
      tagCount.getCount(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType) > 1 ||
      tagCount.getCount(CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType) > 1
    ) {
      throw new TlvError(
        'Only one from publication record or calendar authentication record is allowed in KSI signature.'
      );
    }

    if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.TagType) > 1) {
      throw new TlvError('Only one RFC 3161 record is allowed in KSI signature.');
    }
  }
}
