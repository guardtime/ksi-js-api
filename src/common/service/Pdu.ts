/*
 * Copyright 2013-2019 Guardtime, Inc.
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

import HMAC from '@guardtime/common/lib/crypto/HMAC';
import DataHash from '@guardtime/common/lib/hash/DataHash';
import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import { PDU_CONSTANTS, PDU_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { TlvError } from '../parser/TlvError';
import { TlvInputStream } from '../parser/TlvInputStream';
import { TlvTag } from '../parser/TlvTag';
import { ErrorPayload } from './ErrorPayload';
import { PduHeader } from './PduHeader';
import { PduPayload } from './PduPayload';

/**
 * PDU base classes TLV object.
 */
export abstract class Pdu extends CompositeTag {
  protected payloads: PduPayload[] = [];
  protected errorPayload: ErrorPayload | null = null;
  private header: PduHeader;
  private hmac: ImprintTag;

  /**
   * PDU base classes TLV object constructor.
   * @param tlvTag TLV object.
   */
  protected constructor(tlvTag: TlvTag) {
    super(tlvTag);
  }

  /**
   * Create PDU TLV object.
   * @param id TLV id.
   * @param header Pdu header.
   * @param payload Pdu payload.
   * @param algorithm HMAC algorithm.
   * @param key HMAC key.
   * @returns PDU TLV object.
   */
  protected static async CREATE_PDU(
    id: number,
    header: PduHeader,
    payload: PduPayload,
    algorithm: HashAlgorithm,
    key: Uint8Array
  ): Promise<TlvTag> {
    const pduBytes: Uint8Array = CompositeTag.CREATE_FROM_LIST(id, false, false, [
      header,
      payload,
      ImprintTag.CREATE(
        PDU_CONSTANTS.MacTagType,
        false,
        false,
        DataHash.create(algorithm, new Uint8Array(algorithm.length))
      ),
    ]).encode();
    pduBytes.set(
      await HMAC.digest(algorithm, key, pduBytes.slice(0, -algorithm.length)),
      pduBytes.length - algorithm.length
    );

    return new TlvInputStream(pduBytes).readTag();
  }

  /**
   * Verify PDU HMAC.
   * @param algorithm Hash algorithm.
   * @param key HMAC key.
   */
  public async verifyHmac(algorithm: HashAlgorithm, key: Uint8Array): Promise<boolean> {
    const pduBytes = this.encode();
    const pduHmac = this.hmac.getValue();
    const calculatedHmac = DataHash.create(
      algorithm,
      await HMAC.digest(algorithm, key, pduBytes.slice(0, -algorithm.length))
    );
    return pduHmac.equals(calculatedHmac);
  }

  /**
   * Get PDU error payload.
   * @returns Error payload if exists, null otherwise.
   */
  public getErrorPayload(): ErrorPayload | null {
    return this.errorPayload;
  }

  /**
   * Get all PDU payloads.
   * @returns All PDU payloads.
   */
  public getPayloads(): PduPayload[] {
    return this.payloads;
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PDU_HEADER_CONSTANTS.TagType:
        return (this.header = new PduHeader(tlvTag));
      case PDU_CONSTANTS.MacTagType:
        return (this.hmac = new ImprintTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  protected validate(): void {
    if (this.errorPayload != null) {
      return;
    }

    if (this.payloads.length === 0) {
      throw new TlvError('Payloads are missing in PDU.');
    }
    if (this.getCount(PDU_HEADER_CONSTANTS.TagType) !== 1) {
      throw new TlvError('Exactly one header must exist in PDU.');
    }
    if (this.value[0] !== this.header) {
      throw new TlvError('Header must be the first element in PDU.');
    }
    if (this.getCount(PDU_CONSTANTS.MacTagType) !== 1) {
      throw new TlvError('Exactly one MAC must exist in PDU.');
    }
    if (this.value[this.value.length - 1] !== this.hmac) {
      throw new TlvError('MAC must be the last element in PDU.');
    }
  }
}
