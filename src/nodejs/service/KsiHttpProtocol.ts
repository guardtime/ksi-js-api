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

import { EventEmitter } from 'events';
import { ClientRequest, IncomingMessage, request as httpRequest, RequestOptions } from 'http';
import { request as httpsRequest } from 'https';
import { URL } from 'url';
import { KsiServiceError } from '../../common/service/KsiServiceError.js';
import { KsiRequest } from './KsiRequest.js';

/**
 * HTTP protocol for requests.
 * @deprecated Use common/service/KsiHttpProtocol instead and make sure to polyfill fetch.
 */
export class KsiHttpProtocol {
  private readonly url: URL;

  /**
   * HTTP protocol for requests constructor.
   * @param url
   */
  public constructor(url: string) {
    this.url = new URL(url);
  }

  /**
   * Make a KSI request.
   * @param requestBytes Request bytes.
   * @param eventEmitter Event emitter for cancelling request event.
   * @returns Returns promise for response bytes or null if request was cancelled.
   */
  public requestKsi(requestBytes: Uint8Array, eventEmitter: EventEmitter): Promise<Uint8Array | null> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Promise(
      (
        resolve: (value?: PromiseLike<Uint8Array | null> | Uint8Array | null) => void,
        reject: (reason?: string) => void
      ): void => {
        const request: ClientRequest = this.makeRequest(
          {
            protocol: this.url.protocol,
            hostname: this.url.hostname,
            port: this.url.port,
            path: this.url.pathname,
            method: 'POST',
            headers: {
              'Content-Type': 'application/ksi-request',
              'Content-Length': requestBytes.length.toString(),
            },
          },
          (response: IncomingMessage): void => {
            let data: Buffer = Buffer.alloc(0);
            response.on('data', (chunk: Uint8Array): void => {
              data = Buffer.concat([data, chunk]);
            });

            response.on('end', () => {
              resolve(new Uint8Array(data));
            });
          }
        );

        request.on('error', (event: string) => {
          reject(event);
        });

        eventEmitter.once(KsiRequest.ABORT_EVENT, () => {
          request.abort();
          resolve(null);
        });

        request.write(Buffer.from(requestBytes));
        request.end();
      }
    );
  }

  /**
   * Download bytes from URL.
   * @returns {Promise<Uint8Array>} Response bytes promise.
   */
  public download(): Promise<Uint8Array> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Promise(
      (resolve: (value?: PromiseLike<Uint8Array> | Uint8Array) => void, reject: (reason?: string) => void): void => {
        const request: ClientRequest = this.makeRequest(
          {
            protocol: this.url.protocol,
            hostname: this.url.hostname,
            port: this.url.port,
            path: this.url.pathname,
          },
          (response: IncomingMessage): void => {
            let data: Buffer = Buffer.alloc(0);
            response.on('data', (chunk: Uint8Array): void => {
              data = Buffer.concat([data, chunk]);
            });

            response.on('end', () => {
              resolve(new Uint8Array(data));
            });
          }
        );

        request.on('error', (event: string) => {
          reject(event);
        });

        request.end();
      }
    );
  }

  /**
   * Make request with given options and callback for response.
   * @param options Request options.
   * @param callback Callback for incoming result.
   */
  private makeRequest(options: RequestOptions, callback: (response: IncomingMessage) => void): ClientRequest {
    if (this.url.protocol === 'https:') {
      return httpsRequest(options, callback);
    } else if (this.url.protocol === 'http:') {
      // tslint:disable-line: no-http-string
      return httpRequest(options, callback);
    }

    throw new KsiServiceError(`Network protocol not supported: ${this.url.protocol}.`);
  }
}
