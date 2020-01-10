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

import bigInteger from 'big-integer';
import {IntegerTag} from '../../src/common/parser/IntegerTag';
import {TlvTag} from '../../src/common/parser/TlvTag';

/**
 * IntegerTag tests
 */
describe('IntegerTag', () => {
    it('Creation from tlvTag', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x61, 0xA8]));
        const objectTag: IntegerTag = new IntegerTag(tlvTag);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(bigInteger(25000));
    });

    it('Creation with CREATE', () => {
        const objectTag: IntegerTag = IntegerTag.CREATE(0x1, true, true, bigInteger(25000));
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(bigInteger(25000));
    });

    it('toString output', () => {
        let objectTag: IntegerTag = IntegerTag.CREATE(0x1, true, true, bigInteger(25000));
        expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:i25000');
        objectTag = IntegerTag.CREATE(0x20, false, false, bigInteger(25000));
        expect(objectTag.toString()).toEqual('TLV[0x20]:i25000');
    });

    it('Value cannot be changed', () => {
        const objectTag: IntegerTag = IntegerTag.CREATE(0x1, false, false, bigInteger(25000));
        // @ts-ignore
        expect(() => { objectTag.value = 5000; }).toThrow(TypeError);
    });
});
