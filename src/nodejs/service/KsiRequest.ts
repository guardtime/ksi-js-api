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

import { EventEmitter } from 'events';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { PduPayload } from '../../common/service/PduPayload';

/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
  public static readonly ABORT_EVENT: string = 'ABORT';

  private aborted = false;
  private readonly eventEmitter: EventEmitter;
  private responsePayload: PduPayload;

  constructor(response: Promise<Uint8Array | null>, eventEmitter: EventEmitter) {
    super(response);

    this.eventEmitter = eventEmitter;
  }

  public abort(responsePdu: PduPayload): void {
    this.responsePayload = responsePdu;
    this.eventEmitter.emit(KsiRequest.ABORT_EVENT);
  }

  public getAbortResponse(): PduPayload {
    return this.responsePayload;
  }

  public isAborted(): boolean {
    return this.aborted;
  }
}
