/*
 * Copyright 2013-2019 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import bigInteger from 'big-integer';

import { AGGREGATION_HASH_CHAIN_CONSTANTS } from '../../src/common/Constants';
import { CompositeTag } from '../../src/common/parser/CompositeTag';
import { IntegerTag } from '../../src/common/parser/IntegerTag';
import { RawTag } from '../../src/common/parser/RawTag';
import { StringTag } from '../../src/common/parser/StringTag';
import { TlvTag } from '../../src/common/parser/TlvTag';
import { AggregationHashChainLinkMetaData } from '../../src/common/signature/AggregationHashChain';

/**
 * Aggregation hash chain link metadata TLV tag tests
 */
describe('AggregationHashChainLinkMetaData', () => {
  it('Creation with TlvTag', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType,
      false,
      false,
      [
        RawTag.CREATE(
          AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingTagType,
          false,
          false,
          AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd
        ),
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
      ]
    );

    const metaData: AggregationHashChainLinkMetaData = new AggregationHashChainLinkMetaData(tlvTag);
    expect(metaData.getClientId()).toEqual('test_client');
    expect(metaData.getMachineId()).toEqual('test_machine');
    expect(metaData.getSequenceNumber()).toEqual(bigInteger(0));
    expect(metaData.getRequestTime()).toEqual(bigInteger(1000));
    expect((metaData.getPaddingTag() as RawTag).getValue()).toEqual(
      AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd
    );
  });

  it('Creation with TlvTag containing only client Id', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType,
      false,
      false,
      [StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')]
    );

    const metaData: AggregationHashChainLinkMetaData = new AggregationHashChainLinkMetaData(tlvTag);
    expect(metaData.getClientId()).toEqual('test_client');
    expect(metaData.getMachineId()).toEqual(null);
    expect(metaData.getSequenceNumber()).toEqual(null);
    expect(metaData.getRequestTime()).toEqual(null);
    expect(metaData.getPaddingTag()).toEqual(null);
  });

  it('Creation with TlvTag missing client id', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType,
      false,
      false,
      [
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
      ]
    );

    expect(() => {
      return new AggregationHashChainLinkMetaData(tlvTag);
    }).toThrow('Exactly one client id must exist in aggregation hash chain link metadata.');
  });

  it('Creation with TlvTag containing multiple client id', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType,
      false,
      false,
      [
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client1'),
      ]
    );

    expect(() => {
      return new AggregationHashChainLinkMetaData(tlvTag);
    }).toThrow('Exactly one client id must exist in aggregation hash chain link metadata.');
  });

  it('Creation with TlvTag containing multiple machine id', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType,
      false,
      false,
      [
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine1'),
      ]
    );

    expect(() => {
      return new AggregationHashChainLinkMetaData(tlvTag);
    }).toThrow('Only one machine id is allowed in aggregation hash chain link metadata.');
  });

  it('Creation with TlvTag containing multiple sequence number', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType,
      false,
      false,
      [
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(1)),
      ]
    );

    expect(() => {
      return new AggregationHashChainLinkMetaData(tlvTag);
    }).toThrow('Only one sequence number is allowed in aggregation hash chain link metadata.');
  });

  it('Creation with TlvTag containing multiple request time', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType,
      false,
      false,
      [
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
        StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
        IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1)),
      ]
    );

    expect(() => {
      return new AggregationHashChainLinkMetaData(tlvTag);
    }).toThrow('Only one request time is allowed in aggregation hash chain link metadata.');
  });
});
