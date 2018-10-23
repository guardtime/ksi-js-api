/**
 * TLV stream constants
 */
export const TLV_CONSTANTS = Object.freeze({
    ForwardFlagBit: 0b00100000,
    MaxType: 0x1FFF,
    NonCriticalFlagBit: 0b01000000,
    Tlv16BitFlagBit: 0b10000000,
    TypeMask: 0b00011111
});
/**
 * Certificate Record TLV constants
 */
export const CERTIFICATE_RECORD_CONSTANTS = Object.freeze({
    TagType: 0x702,
    CertificateIdTagType: 0x1,
    X509CertificateTagType: 0x2
});
/**
 * Publication Data TLV constants
 */
export const PUBLICATION_DATA_CONSTANTS = Object.freeze({
    TagType: 0x10,
    PublicationHashTagType: 0x4,
    PublicationTimeTagType: 0x2
});
/**
 * Publication Record TLV constants
 */
export const PUBLICATION_RECORD_CONSTANTS = Object.freeze({
    PublicationReferencesTagType: 0x9,
    PublicationRepositoryUriTagType: 0xA
});
/**
 * Publications File Header TLV constants
 */
export const PUBLICATIONS_FILE_HEADER_CONSTANTS = Object.freeze({
    TagType: 0x701,
    CreationTimeTagType: 0x2,
    RepositoryUriTagType: 0x3,
    VersionTagType: 0x1
});
/**
 * Publications File Constants
 */
export const PUBLICATIONS_FILE_CONSTANTS = Object.freeze({
    CmsSignatureTagType: 0x704,
    PublicationRecordTagType: 0x703
});
export const AGGREGATION_HASH_CHAIN_CONSTANTS = Object.freeze({
    LINK: Object.freeze({
        LevelCorrectionTagType: 0x1,
        SiblingHashTagType: 0x2,
        LegacyId: 0x3
    }),
    METADATA: Object.freeze({
        TagType: 0x4,
        PaddingTagType: 0x1E,
        ClientIdTagType: 0x1,
        MachineIdTagType: 0x2,
        SequenceNumberTagType: 0x3,
        RequestTimeTagType: 0x4,
        PaddingKnownValueEven: new Uint8Array([0x1, 0x1]),
        PaddingKnownValueOdd: new Uint8Array([0x1, 0x1])
    }),
    TagType: 0x801,
    AggregationTimeTagType: 0x2,
    ChainIndexTagType: 0x3,
    InputDataTagType: 0x4,
    InputHashTagType: 0x5,
    AggregationAlgorithmIdTagType: 0x6
});
export const CALENDAR_HASH_CHAIN_CONSTANTS = Object.freeze({
    TagType: 0x802,
    PublicationTimeTagType: 0x1,
    AggregationTimeTagType: 0x2,
    InputHashTagType: 0x5
});
export const KSI_SIGNATURE_CONSTANTS = Object.freeze({
    TagType: 0x800,
    PublicationRecordTagType: 0x803
});
export const CALENDAR_AUTHENTICATION_RECORD_CONSTANTS = Object.freeze({
    TagType: 0x805
});
export const RFC_3161_RECORD_CONSTANTS = Object.freeze({
    TagType: 0x806,
    AggregationTimeTagType: 0x2,
    ChainIndexTagType: 0x3,
    InputHashTagType: 0x5,
    TstInfoPrefixTagType: 0x10,
    TstInfoSuffixTagType: 0x11,
    TstInfoAlgorithmTagType: 0x12,
    SignedAttributesPrefixTagType: 0x13,
    SignedAttributesSuffixTagType: 0x14,
    SignedAttributesAlgorithmTagType: 0x15
});
export const SIGNATURE_DATA_CONSTANTS = Object.freeze({
    TagType: 0xB,
    SignatureTypeTagType: 0x1,
    SignatureValueTagType: 0x2,
    CertificateIdTagType: 0x3,
    CertificateRepositoryUriTagType: 0x4
});
export const PDU_HEADER_CONSTANTS = Object.freeze({
    TagType: 0x1,
    LoginIdTagType: 0x1,
    InstanceIdTagType: 0x2,
    MessageIdTagType: 0x3
});
export const PDU_PAYLOAD_CONSTANTS = Object.freeze({
    RequestIdTagType: 0x1,
    StatusTagType: 0x4,
    ErrorMessageTagType: 0x5
});
export const AGGREGATION_REQUEST_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x2,
    RequestHashTagType: 0x2,
    RequestLevelTagType: 0x3
});
export const AGGREGATION_REQUEST_PDU_CONSTANTS = Object.freeze({
    TagType: 0x220
});
export const AGGREGATION_RESPONSE_PDU_CONSTANTS = Object.freeze({
    TagType: 0x221
});
export const AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x2
});
export const ERROR_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x3
});
export const AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x4,
    MaxLevelTagType: 0x1,
    AggregationAlgorithmTagType: 0x2,
    AggregationPeriodTagType: 0x3,
    MaxRequestsTagType: 0x4,
    ParentUriTagType: 0x5
});
export const AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x5
});
export const AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x4
});
export const EXTEND_REQUEST_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x2,
    AggregationTimeTagType: 0x2,
    PublicationTimeTagType: 0x3
});
export const EXTEND_REQUEST_PDU_CONSTANTS = Object.freeze({
    TagType: 0x320
});
export const EXTEND_RESPONSE_PDU_CONSTANTS = Object.freeze({
    TagType: 0x321
});
export const EXTEND_RESPONSE_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x2,
    CalendarLastTimeTagType: 0x12
});
export const EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x4
});
export const EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS = Object.freeze({
    TagType: 0x4,
    MaxRequestsTagType: 0x4,
    ParentUriTagType: 0x10,
    CalendarFirstTimeTagType: 0x11,
    CalendarLastTimeTagType: 0x12
});
export const PDU_CONSTANTS = Object.freeze({
    MacTagType: 0x1F
});
export var LinkDirection;
(function (LinkDirection) {
    LinkDirection[LinkDirection["Left"] = 7] = "Left";
    LinkDirection[LinkDirection["Right"] = 8] = "Right";
})(LinkDirection || (LinkDirection = {}));
