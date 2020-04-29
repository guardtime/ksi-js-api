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

import { SIGNATURE_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { RawTag } from '../parser/RawTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';

/**
 * Signature data TLV object.
 */
export class SignatureData extends CompositeTag {
  private certificateId: RawTag;
  private certificateRepositoryUri: StringTag;
  private signatureType: StringTag;
  private signatureValue: RawTag;

  /**
   * Signature data TLV object constructor.
   * @param tlvTag TLV object.
   */
  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get signature type.
   * @returns Signature type.
   */
  public getSignatureType(): string {
    return this.signatureType.getValue();
  }

  /**
   * Get certificate ID.
   * @returns Certificate ID.
   */
  public getCertificateId(): Uint8Array {
    return this.certificateId.getValue();
  }

  /**
   * Get signature value.
   * @returns Signature value.
   */
  public getSignatureValue(): Uint8Array {
    return this.signatureValue.getValue();
  }

  /**
   * Get certificate repository URI.
   * @returns Repository URI.
   */
  public getCertificateRepositoryUri(): string {
    return this.certificateRepositoryUri.getValue();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType:
        return (this.signatureType = new StringTag(tlvTag));
      case SIGNATURE_DATA_CONSTANTS.SignatureValueTagType:
        return (this.signatureValue = new RawTag(tlvTag));
      case SIGNATURE_DATA_CONSTANTS.CertificateIdTagType:
        return (this.certificateId = new RawTag(tlvTag));
      case SIGNATURE_DATA_CONSTANTS.CertificateRepositoryUriTagType:
        return (this.certificateRepositoryUri = new StringTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType) !== 1) {
      throw new TlvError('Exactly one signature type must exist in signature data.');
    }

    if (this.getCount(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType) !== 1) {
      throw new TlvError('Exactly one signature value must exist in signature data.');
    }

    if (this.getCount(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType) !== 1) {
      throw new TlvError('Exactly one certificate id must exist in signature data.');
    }

    if (this.getCount(SIGNATURE_DATA_CONSTANTS.CertificateRepositoryUriTagType) > 1) {
      throw new TlvError('Only one certificate repository uri is allowed in signature data.');
    }
  }
}
