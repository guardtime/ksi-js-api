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

import { KsiServiceError } from './KsiServiceError';

/**
 * HTTP protocol for requests.
 */
export class KsiHttpProtocol {
  private readonly url: string;

  /**
   * HTTP protocol for requests constructor.
   * @param url
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
   * Download bytes from url.
   * @returns {Promise<Uint8Array>} Response bytes promise.
   */
  public async download(): Promise<Uint8Array> {
    const response: Response = await fetch(this.url);

    return new Uint8Array(await response.arrayBuffer());
  }
}
