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

import HexCoder from '@guardtime/gt-js-common/lib/coders/HexCoder';
import { TlvError } from '../../src/common/parser/TlvError';
import { TlvInputStream } from '../../src/common/parser/TlvInputStream';
import { TlvTag } from '../../src/common/parser/TlvTag';

/**
 * TlvInputStream tests
 */
describe('TlvInputStream', () => {
  it('Read valid TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('010101'));
    const tlvTag: TlvTag = stream.readTag();
    expect(stream.getPosition()).toEqual(3);
    expect(stream.getLength()).toEqual(3);
    expect(tlvTag.id).toEqual(0x1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1]));
  });

  it('Read 16bit id TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('8001000101'));
    const tlvTag: TlvTag = stream.readTag();
    expect(tlvTag.id).toEqual(1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1]));
  });

  it('Read 16bit length TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(
      HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`)
    );
    const tlvTag: TlvTag = stream.readTag();
    expect(tlvTag.id).toEqual(1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    const valueBytes: Uint8Array = new Uint8Array(256);
    valueBytes.set([0x1]);
    expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
  });

  it('Read 16bit length TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(
      HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`)
    );
    const tlvTag: TlvTag = stream.readTag();
    expect(tlvTag.id).toEqual(1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    const valueBytes: Uint8Array = new Uint8Array(256);
    valueBytes.set([0x1]);
    expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
  });

  it('Read 16bit length TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(
      HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`)
    );
    const tlvTag: TlvTag = stream.readTag();
    expect(tlvTag.id).toEqual(1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    const valueBytes: Uint8Array = new Uint8Array(256);
    valueBytes.set([0x1]);
    expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
  });

  it('Read TLV with invalid length of data', () => {
    const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('01030101'));
    expect(() => {
      stream.readTag();
    }).toThrow(TlvError);
  });

  it('Read TLV with invalid length', () => {
    const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('01'));
    expect(() => {
      stream.readTag();
    }).toThrow(TlvError);
  });
});
