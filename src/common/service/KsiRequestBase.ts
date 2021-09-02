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

import { PduPayload } from './PduPayload.js';

/**
 * KSI request base class for PDU exchanging with KSI servers.
 */
export abstract class KsiRequestBase {
  private readonly response: Promise<Uint8Array | null>;

  /**
   * KSI request base class constructor.
   * @param response Response promise.
   */
  protected constructor(response: Promise<Uint8Array | null>) {
    this.response = response;
  }

  /**
   * Get successful KSI request response.
   * @returns {Promise<Uint8Array | null>} Response bytes.
   */
  public async getResponse(): Promise<Uint8Array | null> {
    return this.response;
  }

  /**
   * Get abort response.
   * @returns Abort response.
   */
  public abstract getAbortResponse(): PduPayload;

  /**
   * Is request aborted.
   * @returns True if request was aborted.
   */
  public abstract isAborted(): boolean;

  /**
   * Abort a request with response payload.
   * @param payload Payload to use for response.
   */
  public abstract abort(payload: PduPayload): void;
}
