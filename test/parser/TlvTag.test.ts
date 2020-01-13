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

import {StringTag} from '../../src/common/parser/StringTag';
import {TlvError} from '../../src/common/parser/TlvError';
import {TlvTag} from '../../src/common/parser/TlvTag';

/**
 * TlvTag tests
 */
describe('TlvTag', () => {
    it('Creation', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x1, 0x2]));
        expect(tlvTag.id).toEqual(0x1);
        expect(tlvTag.nonCriticalFlag).toBeTruthy();
        expect(tlvTag.forwardFlag).toBeTruthy();
        expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
        expect(tlvTag.tlv16BitFlag).toBeFalsy();
    });

    it('Variables cannot be changed', () => {
        const bytes: Uint8Array =  new Uint8Array([0x1, 0x2]);
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, bytes);
        expect(tlvTag.id).toEqual(0x1);
        // @ts-ignore
        expect(() => { tlvTag.id = 1; }).toThrow(TypeError);
        expect(tlvTag.nonCriticalFlag).toBeTruthy();
        // @ts-ignore
        expect(() => { tlvTag.nonCriticalFlag = false; }).toThrow(TypeError);
        expect(tlvTag.forwardFlag).toBeTruthy();
        // @ts-ignore
        expect(() => { tlvTag.forwardFlag = false; }).toThrow(TypeError);
        bytes.set([0x3, 0x4]);
        expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
        tlvTag.getValueBytes().set([0x3, 0x4]);
        expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
    });

    it ('TlvTag equals', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, false, false, new Uint8Array([0x0, 0x1, 0x2]));
        expect(tlvTag.equals(null)).toBeFalsy();
        // tslint:disable-next-line:no-unused-expression
        expect(tlvTag.equals(void TlvTag)).toBeFalsy();
        expect(tlvTag.equals(0)).toBeFalsy();
        expect(tlvTag.equals([])).toBeFalsy();
        expect(tlvTag.equals({})).toBeFalsy();
        expect(tlvTag.equals(new TlvError(''))).toBeFalsy();
        expect(tlvTag.equals(new TlvTag(0x2, false, false, new Uint8Array([0x0, 0x1, 0x2])))).toBeFalsy();
        expect(tlvTag.equals(new TlvTag(0x1, true, false, new Uint8Array([0x0, 0x1, 0x2])))).toBeFalsy();
        expect(tlvTag.equals(new TlvTag(0x1, false, true, new Uint8Array([0x0, 0x1, 0x2])))).toBeFalsy();
        expect(tlvTag.equals(new TlvTag(0x1, false, false, new Uint8Array([0x1, 0x1, 0x2])))).toBeFalsy();
        expect(tlvTag.equals(StringTag.CREATE(0x1, false, false, 'test'))).toBeFalsy();
        expect(tlvTag.equals(new TlvTag(0x1, false, false, new Uint8Array([0x0, 0x1, 0x2])))).toBeTruthy();
    });

});
