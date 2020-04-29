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
import { ClientRequest, IncomingMessage, request as httpRequest, RequestOptions } from 'http';
import { request as httpsRequest } from 'https';
import { URL } from 'url';
import { KsiServiceError } from '../../common/service/KsiServiceError';
import { KsiRequest } from './KsiRequest';

/**
 * Http protocol for requests
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
   * @returns {Promise<Uint8Array | null>} Returns promise for response bytes or null if request was cancelled.
   */
  public requestKsi(requestBytes: Uint8Array, eventEmitter: EventEmitter): Promise<Uint8Array | null> {
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
              'Content-Length': requestBytes.length.toString()
            }
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
   * Download bytes from url.
   * @returns {Promise<Uint8Array>} Response bytes promise.
   */
  public download(): Promise<Uint8Array> {
    return new Promise(
      (resolve: (value?: PromiseLike<Uint8Array> | Uint8Array) => void, reject: (reason?: string) => void): void => {
        const request: ClientRequest = this.makeRequest(
          {
            protocol: this.url.protocol,
            hostname: this.url.hostname,
            port: this.url.port,
            path: this.url.pathname
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
