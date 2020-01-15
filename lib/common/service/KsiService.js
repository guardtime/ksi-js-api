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
import bigInteger from 'big-integer';
import { KsiServiceError } from './KsiServiceError';
/**
 * KSI service.
 */
export class KsiService {
    constructor(signingService = null, extendingService = null, publicationsFileService) {
        this.signingService = signingService;
        this.extendingService = extendingService;
        this.publicationsFileService = publicationsFileService;
    }
    sign(hash, level = bigInteger(0)) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signingService) {
                throw new KsiServiceError('Signing protocol not defined. Cannot use signing.');
            }
            return this.signingService.sign(hash, level);
        });
    }
    extend(aggregationTime, publicationTime = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.extendingService) {
                throw new KsiServiceError('Extending service not defined. Cannot use extending.');
            }
            return this.extendingService.extend(aggregationTime, publicationTime);
        });
    }
    getPublicationsFile() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.publicationsFileService) {
                throw new KsiServiceError('Publications file service not defined. Cannot get publications file.');
            }
            return this.publicationsFileService.getPublicationsFile();
        });
    }
}
