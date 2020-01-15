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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiServiceError } from '../../common/service/KsiServiceError';
/**
 * Http protocol for requests
 */
export class KsiHttpProtocol {
    constructor(url) {
        this.url = url;
    }
    requestKsi(requestBytes, abortController) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url, {
                method: 'POST',
                body: requestBytes,
                headers: new Headers({
                    'Content-Type': 'application/ksi-request',
                    'Content-Length': requestBytes.length.toString()
                }),
                signal: abortController.signal
            });
            if (!response.ok) {
                throw new KsiServiceError(`Request failed. Error code: ${response.status}. Error message: ${response.statusText}`);
            }
            if (abortController.signal.aborted) {
                return null;
            }
            return new Uint8Array(yield response.arrayBuffer());
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url);
            return new Uint8Array(yield response.arrayBuffer());
        });
    }
}
