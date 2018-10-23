declare type TlvConstants = Readonly<{
    ForwardFlagBit: number;
    MaxType: number;
    NonCriticalFlagBit: number;
    Tlv16BitFlagBit: number;
    TypeMask: number;
}>;
declare type CertificateRecordConstants = Readonly<{
    TagType: number;
    CertificateIdTagType: number;
    X509CertificateTagType: number;
}>;
declare type PublicationDataConstants = Readonly<{
    TagType: number;
    PublicationHashTagType: number;
    PublicationTimeTagType: number;
}>;
declare type PublicationRecordConstants = Readonly<{
    PublicationReferencesTagType: number;
    PublicationRepositoryUriTagType: number;
}>;
declare type PublicationsFileHeaderConstants = Readonly<{
    TagType: number;
    CreationTimeTagType: number;
    RepositoryUriTagType: number;
    VersionTagType: number;
}>;
declare type PublicationsFileConstants = Readonly<{
    CmsSignatureTagType: number;
    PublicationRecordTagType: number;
}>;
declare type AggregationHashChainConstants = Readonly<{
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
    }>;
}>;
declare type SignatureDataConstants = Readonly<{
    TagType: number;
    SignatureTypeTagType: number;
    SignatureValueTagType: number;
    CertificateIdTagType: number;
    CertificateRepositoryUriTagType: number;
}>;
declare type Rfc3161RecordConstants = Readonly<{
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
declare type CalendarHashChainConstants = Readonly<{
    TagType: number;
    PublicationTimeTagType: number;
    AggregationTimeTagType: number;
    InputHashTagType: number;
}>;
declare type PduHeaderConstants = Readonly<{
    TagType: number;
    LoginIdTagType: number;
    InstanceIdTagType: number;
    MessageIdTagType: number;
}>;
declare type PduPayloadConstants = Readonly<{
    RequestIdTagType: number;
    StatusTagType: number;
    ErrorMessageTagType: number;
}>;
declare type AggregationRequestPayloadConstants = Readonly<{
    TagType: number;
    RequestHashTagType: number;
    RequestLevelTagType: number;
}>;
/**
 * TLV stream constants
 */
export declare const TLV_CONSTANTS: TlvConstants;
/**
 * Certificate Record TLV constants
 */
export declare const CERTIFICATE_RECORD_CONSTANTS: CertificateRecordConstants;
/**
 * Publication Data TLV constants
 */
export declare const PUBLICATION_DATA_CONSTANTS: PublicationDataConstants;
/**
 * Publication Record TLV constants
 */
export declare const PUBLICATION_RECORD_CONSTANTS: PublicationRecordConstants;
/**
 * Publications File Header TLV constants
 */
export declare const PUBLICATIONS_FILE_HEADER_CONSTANTS: PublicationsFileHeaderConstants;
/**
 * Publications File Constants
 */
export declare const PUBLICATIONS_FILE_CONSTANTS: PublicationsFileConstants;
export declare const AGGREGATION_HASH_CHAIN_CONSTANTS: AggregationHashChainConstants;
export declare const CALENDAR_HASH_CHAIN_CONSTANTS: CalendarHashChainConstants;
export declare const KSI_SIGNATURE_CONSTANTS: Readonly<{
    TagType: number;
    PublicationRecordTagType: number;
}>;
export declare const CALENDAR_AUTHENTICATION_RECORD_CONSTANTS: Readonly<{
    TagType: number;
}>;
export declare const RFC_3161_RECORD_CONSTANTS: Rfc3161RecordConstants;
export declare const SIGNATURE_DATA_CONSTANTS: SignatureDataConstants;
export declare const PDU_HEADER_CONSTANTS: PduHeaderConstants;
export declare const PDU_PAYLOAD_CONSTANTS: PduPayloadConstants;
export declare const AGGREGATION_REQUEST_PAYLOAD_CONSTANTS: AggregationRequestPayloadConstants;
export declare const AGGREGATION_REQUEST_PDU_CONSTANTS: Readonly<{
    TagType: number;
}>;
export declare const AGGREGATION_RESPONSE_PDU_CONSTANTS: Readonly<{
    TagType: number;
}>;
export declare const AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS: Readonly<{
    TagType: number;
}>;
export declare const ERROR_PAYLOAD_CONSTANTS: Readonly<{
    TagType: number;
}>;
declare type AggregatorConfigResponsePayloadConstants = Readonly<{
    TagType: number;
    MaxLevelTagType: number;
    AggregationAlgorithmTagType: number;
    AggregationPeriodTagType: number;
    MaxRequestsTagType: number;
    ParentUriTagType: number;
}>;
export declare const AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS: AggregatorConfigResponsePayloadConstants;
export declare const AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS: Readonly<{
    TagType: number;
}>;
export declare const AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS: Readonly<{
    TagType: number;
}>;
declare type ExtendRequestPayloadConstants = Readonly<{
    TagType: number;
    AggregationTimeTagType: number;
    PublicationTimeTagType: number;
}>;
export declare const EXTEND_REQUEST_PAYLOAD_CONSTANTS: ExtendRequestPayloadConstants;
export declare const EXTEND_REQUEST_PDU_CONSTANTS: Readonly<{
    TagType: number;
}>;
export declare const EXTEND_RESPONSE_PDU_CONSTANTS: Readonly<{
    TagType: number;
}>;
export declare const EXTEND_RESPONSE_PAYLOAD_CONSTANTS: Readonly<{
    TagType: number;
    CalendarLastTimeTagType: number;
}>;
export declare const EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS: Readonly<{
    TagType: number;
}>;
declare type ExtenderConfigResponsePayloadConstants = Readonly<{
    TagType: number;
    MaxRequestsTagType: number;
    ParentUriTagType: number;
    CalendarFirstTimeTagType: number;
    CalendarLastTimeTagType: number;
}>;
export declare const EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS: ExtenderConfigResponsePayloadConstants;
export declare const PDU_CONSTANTS: Readonly<{
    MacTagType: number;
}>;
export declare enum LinkDirection {
    Left = 7,
    Right = 8
}
export {};
