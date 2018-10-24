import { EventEmitter } from 'events';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { URL } from 'url';
import { KsiError } from '../../common/service/KsiError';
import { KsiServiceError } from '../../common/service/KsiServiceError';
import { KsiRequest } from './KsiRequest';
/**
 * Http protocol for requests
 */
export class KsiHttpProtocol {
    constructor(url) {
        if (typeof url !== 'string') {
            throw new KsiError('Invalid url');
        }
        this.url = new URL(url);
    }
    requestKsi(requestBytes, eventEmitter) {
        return new Promise((resolve, reject) => {
            if (!(requestBytes instanceof Uint8Array)) {
                throw new KsiServiceError(`Invalid KSI request bytes: ${requestBytes}`);
            }
            if (!(eventEmitter instanceof EventEmitter)) {
                throw new KsiError('Invalid event emitter');
            }
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
                let data = new Buffer(0);
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
            request.write(new Buffer(requestBytes));
            request.end();
        });
    }
    download() {
        return new Promise((resolve, reject) => {
            const request = httpRequest({
                protocol: this.url.protocol,
                hostname: this.url.hostname,
                port: this.url.port,
                path: this.url.pathname
            }, (response) => {
                let data = new Buffer(0);
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
        throw new KsiServiceError(`Network protocol not supported: ${this.url.protocol}`);
    }
}
