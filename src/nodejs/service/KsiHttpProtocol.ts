import {EventEmitter} from 'events';
import {ClientRequest, IncomingMessage, request as httpRequest} from 'http';
import {URL} from 'url';
import {KsiError} from '../../common/service/KsiError';
import {KsiServiceError} from '../../common/service/KsiServiceError';
import {KsiRequest} from './KsiRequest';

/**
 * Http protocol for requests
 */
export class KsiHttpProtocol {
    private readonly url: URL;

    constructor(url: string) {
        if (typeof url !== 'string') {
            throw new KsiError('Invalid url');
        }

        this.url = new URL(url);
    }

    public requestKsi(requestBytes: Uint8Array, eventEmitter: EventEmitter): Promise<Uint8Array | null> {
        return new Promise((resolve: (value?: (PromiseLike<Uint8Array | null> | Uint8Array | null)) => void,
                            reject: (reason?: any) => void): void => {
            if (!(requestBytes instanceof Uint8Array)) {
                throw new KsiServiceError(`Invalid KSI request bytes: ${requestBytes}`);
            }

            if (!(eventEmitter instanceof EventEmitter)) {
                throw new KsiError('Invalid event emitter');
            }

            const request: ClientRequest = httpRequest(
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
                            reject: (reason?: any) => void): void => {

            const request: ClientRequest = httpRequest(
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

}
