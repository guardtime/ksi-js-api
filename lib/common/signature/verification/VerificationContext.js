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
import { KsiVerificationError } from './KsiVerificationError';
/**
 * Verification context for KSI signature
 */
export class VerificationContext {
    constructor(signature) {
        this.ksiService = null;
        this.documentHash = null;
        this.publicationsFile = null;
        this.publicationData = null;
        this.extendingAllowed = true;
        this.documentHashLevel = bigInteger(0);
        this.ksiSignature = signature;
    }
    getSignature() {
        return this.ksiSignature;
    }
    /**
     * Get extended latest calendar hash chain.
     */
    getExtendedLatestCalendarHashChain() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getExtendedCalendarHashChain(null);
        });
    }
    /**
     * Get extended calendar hash chain from given publication time.
     */
    getExtendedCalendarHashChain(publicationTime) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ksiService) {
                throw new KsiVerificationError('Invalid KSI service in context.');
            }
            return this.ksiService.extend(this.getSignature().getAggregationTime(), publicationTime);
        });
    }
    /**
     * Get document hash.
     */
    getDocumentHash() {
        return this.documentHash;
    }
    setDocumentHash(documentHash) {
        this.documentHash = documentHash;
    }
    setKsiService(ksiService) {
        this.ksiService = ksiService;
    }
    /**
     * Get document hash node level value in the aggregation tree
     */
    getDocumentHashLevel() {
        return this.documentHashLevel;
    }
    setDocumentHashLevel(documentHashLevel) {
        this.documentHashLevel = documentHashLevel;
    }
    getPublicationsFile() {
        return this.publicationsFile;
    }
    setPublicationsFile(publicationsFile) {
        this.publicationsFile = publicationsFile;
    }
    getUserPublication() {
        return this.publicationData;
    }
    setUserPublication(publicationData) {
        this.publicationData = publicationData;
    }
    isExtendingAllowed() {
        return this.extendingAllowed;
    }
    setExtendingAllowed(extendingAllowed) {
        this.extendingAllowed = extendingAllowed;
    }
}
