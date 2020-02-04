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
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { URL } from 'url';
import { KsiServiceError } from '../../common/service/KsiServiceError';
import { KsiRequest } from './KsiRequest';
/**
 * Http protocol for requests
 */
export class KsiHttpProtocol {
    constructor(url) {
        this.url = new URL(url);
    }
    requestKsi(requestBytes, eventEmitter) {
        return new Promise((resolve, reject) => {
            const request = this.makeRequest({
                protocol: this.url.protocol,
                hostname: this.url.hostname,
                port: this.url.port,
                path: this.url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ksi-request',
                    'Content-Length': requestBytes.length.toString()
                }
            }, (response) => {
                let data = Buffer.alloc(0);
                response.on('data', (chunk) => {
                    data = Buffer.concat([data, chunk]);
                });
                response.on('end', () => {
                    resolve(new Uint8Array(data));
                });
            });
            request.on('error', (event) => {
                reject(event);
            });
            eventEmitter.once(KsiRequest.ABORT_EVENT, () => {
                request.abort();
                resolve(null);
            });
            request.write(Buffer.from(requestBytes));
            request.end();
        });
    }
    download() {
        return new Promise((resolve, reject) => {
            const request = this.makeRequest({
                protocol: this.url.protocol,
                hostname: this.url.hostname,
                port: this.url.port,
                path: this.url.pathname
            }, (response) => {
                let data = Buffer.alloc(0);
                response.on('data', (chunk) => {
                    data = Buffer.concat([data, chunk]);
                });
                response.on('end', () => {
                    resolve(new Uint8Array(data));
                });
            });
            request.on('error', (event) => {
                reject(event);
            });
            request.end();
        });
    }
    makeRequest(options, callback) {
        if (this.url.protocol === 'https:') {
            return httpsRequest(options, callback);
        }
        else if (this.url.protocol === 'http:') { // tslint:disable-line: no-http-string
            return httpRequest(options, callback);
        }
        throw new KsiServiceError(`Network protocol not supported: ${this.url.protocol}.`);
    }
}
