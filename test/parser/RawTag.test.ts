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

import {RawTag} from '../../src/common/parser/RawTag';
import {TlvTag} from '../../src/common/parser/TlvTag';

/**
 * RawTag tests
 */
describe('RawTag', () => {
    it('Creation from tlvTag', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x1, 0x2]));
        const objectTag: RawTag = new RawTag(tlvTag);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
        expect(objectTag.equals(RawTag.CREATE(0x1, true, true, new Uint8Array([0x1, 0x2])))).toBeTruthy();
    });

    it('Creation with CREATE', () => {
        const objectTag: RawTag = RawTag.CREATE(0x1, true, true, new Uint8Array([0x1, 0x2]));
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
    });

    it('toString output', () => {
        let objectTag: RawTag = RawTag.CREATE(0x1, true, true, new Uint8Array([0x1, 0x2]));
        expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:0102');
        objectTag = RawTag.CREATE(0x20, false, false, new Uint8Array([0x1, 0x2]));
        expect(objectTag.toString()).toEqual('TLV[0x20]:0102');
    });

    it('Value cannot be changed', () => {
        const bytes: Uint8Array = new Uint8Array([0x1, 0x2]);
        const objectTag: RawTag = RawTag.CREATE(0x1, false, false, bytes);
        bytes.set([0x3, 0x4]);
        expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
        objectTag.getValue().set([0x3, 0x4]);
        expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
    });
});
