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

import { EventEmitter } from 'events';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { PduPayload } from '../../common/service/PduPayload';

/**
 * KSI request for PDU exchanging with KSI servers.
 * @deprecated Use common/service/KsiRequest instead and make sure to polyfill fetch.
 */
export class KsiRequest extends KsiRequestBase {
  /**
   * Event name for aborting request.
   */
  public static readonly ABORT_EVENT: string = 'ABORT';

  private aborted = false;
  private readonly eventEmitter: EventEmitter;
  private responsePayload: PduPayload;

  /**
   * KSI request constructor.
   * @param response Response promise.
   * @param eventEmitter Event emitter for cancelling request.
   */
  public constructor(response: Promise<Uint8Array | null>, eventEmitter: EventEmitter) {
    super(response);

    this.eventEmitter = eventEmitter;
  }

  /**
   * @inheritDoc
   */
  public abort(responsePdu: PduPayload): void {
    this.responsePayload = responsePdu;
    this.eventEmitter.emit(KsiRequest.ABORT_EVENT);
  }

  /**
   * @inheritDoc
   */
  public getAbortResponse(): PduPayload {
    return this.responsePayload;
  }

  /**
   * @inheritDoc
   */
  public isAborted(): boolean {
    return this.aborted;
  }
}
