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

import { CERTIFICATE_RECORD_CONSTANTS } from '../Constants.js';
import { CompositeTag } from '../parser/CompositeTag.js';
import { RawTag } from '../parser/RawTag.js';
import { TlvError } from '../parser/TlvError.js';
import { TlvTag } from '../parser/TlvTag.js';

/**
 * Certificate record TLV object.
 */
export class CertificateRecord extends CompositeTag {
  private certificateId: RawTag;
  private x509Certificate: RawTag;

  /**
   * Certificate record TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get X.509 certificate bytes.
   * @returns Certificate bytes.
   */
  public getX509Certificate(): Uint8Array {
    return this.x509Certificate.getValue();
  }

  /**
   * Get X.509 certificate ID.
   * @returns Certificate ID.
   */
  public getCertificateId(): Uint8Array {
    return this.certificateId.getValue();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType:
        return (this.certificateId = new RawTag(tlvTag));
      case CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType:
        return (this.x509Certificate = new RawTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType) !== 1) {
      throw new TlvError('Exactly one certificate ID must exist in certificate record.');
    }

    if (this.getCount(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType) !== 1) {
      throw new TlvError('Exactly one certificate must exist in certificate record.');
    }
  }
}
