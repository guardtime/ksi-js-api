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

import { KsiServiceError } from './KsiServiceError';
import { abortableFetch } from 'abortcontroller-polyfill/dist/cjs-ponyfill';
import _fetch from 'cross-fetch';
const { fetch } = abortableFetch(_fetch);

/**
 * HTTP protocol for requests.
 */
export class KsiHttpProtocol {
  private readonly url: string;

  /**
   * HTTP protocol for requests constructor.
   * @param url Endpoint URL.
   */
  public constructor(url: string) {
    this.url = url;
  }

  /**
   * Make a KSI request.
   * @param requestBytes Request bytes.
   * @param abortController Abort controller for cancelling request.
   * @returns {Promise<Uint8Array | null>} Returns promise for response bytes or null if request was cancelled.
   */
  public async requestKsi(requestBytes: Uint8Array, abortController: AbortController): Promise<Uint8Array | null> {
    const response: Response = await fetch(this.url, {
      method: 'POST',
      body: requestBytes,
      headers: {
        'Content-Type': 'application/ksi-request',
        'Content-Length': requestBytes.length.toString(),
      },
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new KsiServiceError(
        `Request failed. Error code: ${response.status}. Error message: ${response.statusText}`
      );
    }

    if (abortController.signal.aborted) {
      return null;
    }

    return new Uint8Array(await response.arrayBuffer());
  }

  /**
   * Download bytes from URL.
   * @returns {Promise<Uint8Array>} Response bytes promise.
   */
  public async download(): Promise<Uint8Array> {
    const response: Response = await fetch(this.url);

    return new Uint8Array(await response.arrayBuffer());
  }
}
