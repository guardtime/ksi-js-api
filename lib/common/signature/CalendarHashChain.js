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
import { DataHasher } from '@guardtime/gt-js-common';
import { CALENDAR_HASH_CHAIN_CONSTANTS, LinkDirection } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { PublicationData } from '../publication/PublicationData';
/**
 * Calendar Hash Chain TLV Object
 */
export class CalendarHashChain extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.chainLinks = [];
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    /**
     * Calculate highest bit.
     */
    static highBit(n) {
        let v = n;
        v = v.or(v.shiftRight(1));
        v = v.or(v.shiftRight(2));
        v = v.or(v.shiftRight(4));
        v = v.or(v.shiftRight(8));
        v = v.or(v.shiftRight(16));
        v = v.or(v.shiftRight(32));
        return v.minus(v.shiftRight(1));
    }
    /**
     * Hash two hashes together with algorithm.
     */
    static getStepHash(algorithm, hashA, hashB) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasher = new DataHasher(algorithm);
            hasher.update(hashA);
            hasher.update(hashB);
            hasher.update(new Uint8Array([0xFF]));
            return hasher.digest();
        });
    }
    /**
     * Compare right links if they are equal.
     */
    areRightLinksEqual(calendarHashChain) {
        let i = 0;
        let j = 0;
        while (i < this.chainLinks.length || j < calendarHashChain.chainLinks.length) {
            if (this.chainLinks[i].id !== LinkDirection.Right) {
                i += 1;
                continue;
            }
            if (calendarHashChain.chainLinks[j].id !== LinkDirection.Right) {
                j += 1;
                continue;
            }
            if (!this.chainLinks[i].getValue().equals(calendarHashChain.chainLinks[j].getValue())) {
                return false;
            }
            i += 1;
            j += 1;
        }
        return true;
    }
    calculateRegistrationTime() {
        let r = this.publicationTime.getValue();
        let t = bigInteger(0);
        // iterate over the chain in reverse
        for (let i = this.chainLinks.length - 1; i >= 0; i -= 1) {
            if (r.leq(0)) {
                console.warn('Invalid calendar hash chain shape for publication time. Cannot calculate registration time.');
                return bigInteger(0);
            }
            if (this.chainLinks[i].id === LinkDirection.Left) {
                r = CalendarHashChain.highBit(r).minus(1);
            }
            else {
                t = t.plus(CalendarHashChain.highBit(r));
                r = r.minus(CalendarHashChain.highBit(r));
            }
        }
        if (r.neq(0)) {
            console.warn('Calendar hash chain shape inconsistent with publication time. Cannot calculate registration time.');
            return bigInteger(0);
        }
        return t;
    }
    getChainLinks() {
        return this.chainLinks;
    }
    getPublicationTime() {
        return this.publicationTime.getValue();
    }
    getInputHash() {
        return this.inputHash.getValue();
    }
    getAggregationTime() {
        return this.aggregationTime ? this.aggregationTime.getValue() : this.getPublicationTime();
    }
    /**
     * Calculate output hash.
     */
    calculateOutputHash() {
        return __awaiter(this, void 0, void 0, function* () {
            let inputHash = this.getInputHash();
            for (const link of this.getChainLinks()) {
                const siblingHash = link.getValue();
                if (link.id === LinkDirection.Left) {
                    inputHash = yield CalendarHashChain.getStepHash(siblingHash.hashAlgorithm, inputHash.imprint, siblingHash.imprint);
                }
                if (link.id === LinkDirection.Right) {
                    inputHash = yield CalendarHashChain.getStepHash(inputHash.hashAlgorithm, siblingHash.imprint, inputHash.imprint);
                }
            }
            return inputHash;
        });
    }
    getPublicationData() {
        return __awaiter(this, void 0, void 0, function* () {
            return PublicationData.CREATE(this.publicationTime.getValue(), yield this.calculateOutputHash());
        });
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType:
                return this.publicationTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case LinkDirection.Left:
            case LinkDirection.Right:
                const link = new ImprintTag(tlvTag);
                this.chainLinks.push(link);
                return link;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType) !== 1) {
            throw new TlvError('Exactly one publication time must exist in calendar hash chain.');
        }
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType) > 1) {
            throw new TlvError('Only one aggregation time is allowed in calendar hash chain.');
        }
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType) !== 1) {
            throw new TlvError('Exactly one input hash must exist in calendar hash chain.');
        }
        if (this.chainLinks.length === 0) {
            throw new TlvError('Links are missing in calendar hash chain.');
        }
    }
}
