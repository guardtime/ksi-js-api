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

import { BigInteger } from 'big-integer';
import { PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';

/**
 * PDU payload base class for responses
 */
export abstract class ResponsePayload extends PduPayload {
  private status: IntegerTag;
  private errorMessage: StringTag | null = null;

  protected constructor(tlvTag: TlvTag) {
    super(tlvTag);
  }

  public getStatus(): BigInteger {
    return this.status.getValue();
  }

  public getErrorMessage(): string | null {
    return this.errorMessage !== null ? this.errorMessage.getValue() : null;
  }

  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PDU_PAYLOAD_CONSTANTS.StatusTagType:
        return (this.status = new IntegerTag(tlvTag));
      case PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType:
        return (this.errorMessage = new StringTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  protected validate(): void {
    if (this.getCount(PDU_PAYLOAD_CONSTANTS.StatusTagType) !== 1) {
      throw new TlvError('Exactly one status code must exist in response payload.');
    }

    if (this.getCount(PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType) > 1) {
      throw new TlvError('Only one error message is allowed in response payload.');
    }
  }
}
