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

import { KsiRequestBase } from './KsiRequestBase.js';
import { PduPayload } from './PduPayload.js';

/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
  private readonly abortController: AbortController;
  private abortResponse: PduPayload;

  /**
   * KSI request constructor.
   * @param response Response promise.
   * @param abortController Abort controller for cancelling request.
   */
  public constructor(response: Promise<Uint8Array | null>, abortController: AbortController) {
    super(response);

    this.abortController = abortController;
  }

  /**
   * @inheritDoc
   */
  public abort(payload: PduPayload): void {
    this.abortResponse = payload;
    this.abortController.abort();
  }

  /**
   * @inheritDoc
   */
  public getAbortResponse(): PduPayload {
    return this.abortResponse;
  }

  /**
   * @inheritDoc
   */
  public isAborted(): boolean {
    return this.abortController.signal.aborted;
  }
}
