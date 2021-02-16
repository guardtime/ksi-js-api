/*
 * Copyright 2013-2020 Guardtime, Inc.
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

type TlvConstants = Readonly<{
  ForwardFlagBit: number;
  MaxType: number;
  NonCriticalFlagBit: number;
  Tlv16BitFlagBit: number;
  TypeMask: number;
}>;
type CertificateRecordConstants = Readonly<{
  TagType: number;
  CertificateIdTagType: number;
  X509CertificateTagType: number;
}>;
type PublicationDataConstants = Readonly<{
  TagType: number;
  PublicationHashTagType: number;
  PublicationTimeTagType: number;
}>;
type PublicationRecordConstants = Readonly<{
  PublicationReferencesTagType: number;
  PublicationRepositoryUriTagType: number;
}>;
type PublicationsFileHeaderConstants = Readonly<{
  TagType: number;
  CreationTimeTagType: number;
  RepositoryUriTagType: number;
  VersionTagType: number;
}>;
type PublicationsFileConstants = Readonly<{ CmsSignatureTagType: number; PublicationRecordTagType: number }>;
type AggregationHashChainConstants = Readonly<{
  TagType: number;
  AggregationTimeTagType: number;
  ChainIndexTagType: number;
  InputDataTagType: number;
  InputHashTagType: number;
  AggregationAlgorithmIdTagType: number;
  LINK: Readonly<{
    LevelCorrectionTagType: number;
    SiblingHashTagType: number;
    LegacyId: number;
  }>;
  METADATA: Readonly<{
    TagType: number;
    PaddingTagType: number;
    ClientIdTagType: number;
    MachineIdTagType: number;
    SequenceNumberTagType: number;
    RequestTimeTagType: number;
    PaddingKnownValueEven: Uint8Array;
    PaddingKnownValueOdd: Uint8Array;
  }>;
}>;

type SignatureDataConstants = Readonly<{
  TagType: number;
  SignatureTypeTagType: number;
  SignatureValueTagType: number;
  CertificateIdTagType: number;
  CertificateRepositoryUriTagType: number;
}>;

type Rfc3161RecordConstants = Readonly<{
  TagType: number;
  AggregationTimeTagType: number;
  ChainIndexTagType: number;
  InputHashTagType: number;
  TstInfoPrefixTagType: number;
  TstInfoSuffixTagType: number;
  TstInfoAlgorithmTagType: number;
  SignedAttributesPrefixTagType: number;
  SignedAttributesSuffixTagType: number;
  SignedAttributesAlgorithmTagType: number;
}>;

type CalendarHashChainConstants = Readonly<{
  TagType: number;
  PublicationTimeTagType: number;
  AggregationTimeTagType: number;
  InputHashTagType: number;
}>;

type PduHeaderConstants = Readonly<{
  TagType: number;
  LoginIdTagType: number;
  InstanceIdTagType: number;
  MessageIdTagType: number;
}>;
type PduPayloadConstants = Readonly<{ RequestIdTagType: number; StatusTagType: number; ErrorMessageTagType: number }>;
type AggregationRequestPayloadConstants = Readonly<{
  TagType: number;
  RequestHashTagType: number;
  RequestLevelTagType: number;
}>;

/**
 * TLV stream constants.
 */
export const TLV_CONSTANTS: TlvConstants = Object.freeze({
  ForwardFlagBit: 0b00100000,
  MaxType: 0x1fff,
  NonCriticalFlagBit: 0b01000000,
  Tlv16BitFlagBit: 0b10000000,
  TypeMask: 0b00011111,
});

/**
 * Certificate record TLV constants.
 */
export const CERTIFICATE_RECORD_CONSTANTS: CertificateRecordConstants = Object.freeze({
  TagType: 0x702,

  CertificateIdTagType: 0x1,
  X509CertificateTagType: 0x2,
});

/**
 * Publication data TLV constants.
 */
export const PUBLICATION_DATA_CONSTANTS: PublicationDataConstants = Object.freeze({
  TagType: 0x10,

  PublicationHashTagType: 0x4,
  PublicationTimeTagType: 0x2,
});

/**
 * Publication record TLV constants.
 */
export const PUBLICATION_RECORD_CONSTANTS: PublicationRecordConstants = Object.freeze({
  PublicationReferencesTagType: 0x9,
  PublicationRepositoryUriTagType: 0xa,
});

/**
 * Publications file header TLV constants.
 */
export const PUBLICATIONS_FILE_HEADER_CONSTANTS: PublicationsFileHeaderConstants = Object.freeze({
  TagType: 0x701,

  CreationTimeTagType: 0x2,
  RepositoryUriTagType: 0x3,
  VersionTagType: 0x1,
});

/**
 * Publications file constants.
 */
export const PUBLICATIONS_FILE_CONSTANTS: PublicationsFileConstants = Object.freeze({
  CmsSignatureTagType: 0x704,
  PublicationRecordTagType: 0x703,
});

/**
 * Aggregation hash chain constants.
 */
export const AGGREGATION_HASH_CHAIN_CONSTANTS: AggregationHashChainConstants = Object.freeze({
  LINK: Object.freeze({
    LevelCorrectionTagType: 0x1,
    SiblingHashTagType: 0x2,
    LegacyId: 0x3,
  }),
  METADATA: Object.freeze({
    TagType: 0x4,

    PaddingTagType: 0x1e,
    ClientIdTagType: 0x1,
    MachineIdTagType: 0x2,
    SequenceNumberTagType: 0x3,
    RequestTimeTagType: 0x4,

    PaddingKnownValueEven: new Uint8Array([0x1, 0x1]),
    PaddingKnownValueOdd: new Uint8Array([0x1]),
  }),

  TagType: 0x801,

  AggregationTimeTagType: 0x2,
  ChainIndexTagType: 0x3,
  InputDataTagType: 0x4,
  InputHashTagType: 0x5,
  AggregationAlgorithmIdTagType: 0x6,
});

/**
 * Calendar hash chain constants.
 */
export const CALENDAR_HASH_CHAIN_CONSTANTS: CalendarHashChainConstants = Object.freeze({
  TagType: 0x802,

  PublicationTimeTagType: 0x1,
  AggregationTimeTagType: 0x2,
  InputHashTagType: 0x5,
});

/**
 * KSI signature constants.
 */
export const KSI_SIGNATURE_CONSTANTS: Readonly<{ TagType: number; PublicationRecordTagType: number }> = Object.freeze({
  TagType: 0x800,

  PublicationRecordTagType: 0x803,
});

/**
 * Calendar authentication record constants.
 */
export const CALENDAR_AUTHENTICATION_RECORD_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x805,
});

/**
 * RFC 3161 record constants.
 */
export const RFC_3161_RECORD_CONSTANTS: Rfc3161RecordConstants = Object.freeze({
  TagType: 0x806,

  AggregationTimeTagType: 0x2,
  ChainIndexTagType: 0x3,
  InputHashTagType: 0x5,
  TstInfoPrefixTagType: 0x10,
  TstInfoSuffixTagType: 0x11,
  TstInfoAlgorithmTagType: 0x12,
  SignedAttributesPrefixTagType: 0x13,
  SignedAttributesSuffixTagType: 0x14,
  SignedAttributesAlgorithmTagType: 0x15,
});

/**
 * Signature data constants.
 */
export const SIGNATURE_DATA_CONSTANTS: SignatureDataConstants = Object.freeze({
  TagType: 0xb,

  SignatureTypeTagType: 0x1,
  SignatureValueTagType: 0x2,
  CertificateIdTagType: 0x3,
  CertificateRepositoryUriTagType: 0x4,
});

/**
 * PDU header constants.
 */
export const PDU_HEADER_CONSTANTS: PduHeaderConstants = Object.freeze({
  TagType: 0x1,

  LoginIdTagType: 0x1,
  InstanceIdTagType: 0x2,
  MessageIdTagType: 0x3,
});

/**
 * PDU payload constants.
 */
export const PDU_PAYLOAD_CONSTANTS: PduPayloadConstants = Object.freeze({
  RequestIdTagType: 0x1,
  StatusTagType: 0x4,
  ErrorMessageTagType: 0x5,
});

/**
 * Aggregation request payload constants.
 */
export const AGGREGATION_REQUEST_PAYLOAD_CONSTANTS: AggregationRequestPayloadConstants = Object.freeze({
  TagType: 0x2,

  RequestHashTagType: 0x2,
  RequestLevelTagType: 0x3,
});

/**
 * Aggregation request PDU constants.
 */
export const AGGREGATION_REQUEST_PDU_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x220,
});

/**
 * Aggregation response PDU constants.
 */
export const AGGREGATION_RESPONSE_PDU_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x221,
});

/**
 * Aggregation response payload constants.
 */
export const AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x2,
});

/**
 * Error payload constants.
 */
export const ERROR_PAYLOAD_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x3,
});

type AggregatorConfigResponsePayloadConstants = Readonly<{
  TagType: number;
  MaxLevelTagType: number;
  AggregationAlgorithmTagType: number;
  AggregationPeriodTagType: number;
  MaxRequestsTagType: number;
  ParentUriTagType: number;
}>;

/**
 * Aggregator config response payload constants.
 */
export const AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS: AggregatorConfigResponsePayloadConstants = Object.freeze({
  TagType: 0x4,

  MaxLevelTagType: 0x1,
  AggregationAlgorithmTagType: 0x2,
  AggregationPeriodTagType: 0x3,
  MaxRequestsTagType: 0x4,
  ParentUriTagType: 0x10,
});

/**
 * Aggregation acknowledgment response payload constants.
 */
export const AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x5,
});

/**
 * Aggregator config request payload constants.
 */
export const AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x4,
});

type ExtendRequestPayloadConstants = Readonly<{
  TagType: number;
  AggregationTimeTagType: number;
  PublicationTimeTagType: number;
}>;

/**
 * Extend request payload constants.
 */
export const EXTEND_REQUEST_PAYLOAD_CONSTANTS: ExtendRequestPayloadConstants = Object.freeze({
  TagType: 0x2,

  AggregationTimeTagType: 0x2,
  PublicationTimeTagType: 0x3,
});

/**
 * Extend request PDU constants.
 */
export const EXTEND_REQUEST_PDU_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x320,
});

/**
 * Extend response PDU constants.
 */
export const EXTEND_RESPONSE_PDU_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x321,
});

/**
 * Extend response payload constants.
 */
export const EXTEND_RESPONSE_PAYLOAD_CONSTANTS: Readonly<{
  TagType: number;
  CalendarLastTimeTagType: number;
}> = Object.freeze({
  TagType: 0x2,

  CalendarLastTimeTagType: 0x12,
});

/**
 * Extender configuration request payload constants.
 */
export const EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS: Readonly<{ TagType: number }> = Object.freeze({
  TagType: 0x4,
});

type ExtenderConfigResponsePayloadConstants = Readonly<{
  TagType: number;
  MaxRequestsTagType: number;
  ParentUriTagType: number;
  CalendarFirstTimeTagType: number;
  CalendarLastTimeTagType: number;
}>;

/**
 * Extender configuration response payload constants.
 */
export const EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS: ExtenderConfigResponsePayloadConstants = Object.freeze({
  TagType: 0x4,

  MaxRequestsTagType: 0x4,
  ParentUriTagType: 0x10,
  CalendarFirstTimeTagType: 0x11,
  CalendarLastTimeTagType: 0x12,
});

/**
 * PDU constants.
 */
export const PDU_CONSTANTS: Readonly<{ MacTagType: number }> = Object.freeze({
  MacTagType: 0x1f,
});

/**
 * Link direction.
 */
export enum LinkDirection {
  Left = 0x7,
  Right = 0x8,
}

/**
 * Publications file signature constants.
 */
export const PUBLICATIONS_FILE_SIGNATURE_CONSTANTS: Readonly<{
  TrustedCertificates: string;
  GuardtimeSignatureSubjectEmail: string;
}> = Object.freeze({
  TrustedCertificates:
    '-----BEGIN CERTIFICATE-----\n' +
    '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\n' +
    'Rn7JhIJYRobXTF+4bZk=\n' +
    '-----END CERTIFICATE-----\n',
  GuardtimeSignatureSubjectEmail: 'E=publications@guardtime.com',
});
