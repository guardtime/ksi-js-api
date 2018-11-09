import {EventEmitter} from 'events';
import {ClientRequest, IncomingMessage, request as httpRequest, RequestOptions} from 'http';
import {request as httpsRequest} from 'https';
import {URL} from 'url';
import {KsiServiceError} from '../../common/service/KsiServiceError';
import {KsiRequest} from './KsiRequest';

/**
 * Http protocol for requests
 */
export class KsiHttpProtocol {
    private readonly url: URL;

    constructor(url: string) {
        this.url = new URL(url);
    }

    public requestKsi(requestBytes: Uint8Array, eventEmitter: EventEmitter): Promise<Uint8Array | null> {
        return new Promise((resolve: (value?: (PromiseLike<Uint8Array | null> | Uint8Array | null)) => void,
                            reject: (reason?: string) => void): void => {

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
                    let data: Buffer = new Buffer(0);
                    response.on('data', (chunk: Uint8Array): void => {
                        data = Buffer.concat([data, chunk]);
                    });

                    response.on('end', () => {
                        resolve(new Uint8Array(data));
                    });
                });

            request.on('error', (event: string) => {
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

    public download(): Promise<Uint8Array> {
        return new Promise((resolve: (value?: (PromiseLike<Uint8Array> | Uint8Array)) => void,
                            reject: (reason?: string) => void): void => {

            const request: ClientRequest = this.makeRequest(
                {
                    protocol: this.url.protocol,
                    hostname: this.url.hostname,
                    port: this.url.port,
                    path: this.url.pathname
                },
                (response: IncomingMessage): void => {
                    let data: Buffer = new Buffer(0);
                    response.on('data', (chunk: Uint8Array): void => {
                        data = Buffer.concat([data, chunk]);
                    });

                    response.on('end', () => {
                        resolve(new Uint8Array(data));
                    });
                });

            request.on('error', (event: string) => {
                reject(event);
            });

            request.end();
        });
    }

    private makeRequest(options: RequestOptions, callback: (response: IncomingMessage) => void): ClientRequest {
        if (this.url.protocol === 'https:') {
            return httpsRequest(options, callback);
        } else if (this.url.protocol === 'http:') {// tslint:disable-line: no-http-string
            return httpRequest(options, callback);
        }

        throw new KsiServiceError(`Network protocol not supported: ${this.url.protocol}.`);
    }

}
