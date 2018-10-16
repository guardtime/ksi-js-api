type TlvConstants =
    Readonly<{ ForwardFlagBit: number; MaxType: number; NonCriticalFlagBit: number; Tlv16BitFlagBit: number; TypeMask: number }>;
type CertificateRecordConstants = Readonly<{ TagType: number; CertificateIdTagType: number; X509CertificateTagType: number }>;
type PublicationDataConstants = Readonly<{ TagType: number; PublicationHashTagType: number; PublicationTimeTagType: number }>;
type PublicationRecordConstants = Readonly<{ PublicationReferencesTagType: number; PublicationRepositoryUriTagType: number }>;
type PublicationsFileHeaderConstants =
    Readonly<{ TagType: number; CreationTimeTagType: number; RepositoryUriTagType: number; VersionTagType: number }>;
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
    }>;
}>;

/**
 * TLV stream constants
 */
export const TLV_CONSTANTS: TlvConstants =
    Object.freeze({
        ForwardFlagBit: 0b00100000,
        MaxType: 0x1FFF,
        NonCriticalFlagBit: 0b01000000,
        Tlv16BitFlagBit: 0b10000000,
        TypeMask: 0b00011111
    });

/**
 * Certificate Record TLV constants
 */
export const CERTIFICATE_RECORD_CONSTANTS: CertificateRecordConstants = Object.freeze({
    TagType: 0x702,

    CertificateIdTagType: 0x1,
    X509CertificateTagType: 0x2
});

/**
 * Publication Data TLV constants
 */
export const PUBLICATION_DATA_CONSTANTS: PublicationDataConstants = Object.freeze({
    TagType: 0x10,

    PublicationHashTagType: 0x4,
    PublicationTimeTagType: 0x2
});

/**
 * Publication Record TLV constants
 */
export const PUBLICATION_RECORD_CONSTANTS: PublicationRecordConstants = Object.freeze({
    PublicationReferencesTagType: 0x9,
    PublicationRepositoryUriTagType: 0xA
});

/**
 * Publications File Header TLV constants
 */
export const PUBLICATIONS_FILE_HEADER_CONSTANTS: PublicationsFileHeaderConstants = Object.freeze({
    TagType: 0x701,

    CreationTimeTagType: 0x2,
    RepositoryUriTagType: 0x3,
    VersionTagType: 0x1
});

/**
 * Publications File Constants
 */
export const PUBLICATIONS_FILE_CONSTANTS: PublicationsFileConstants = Object.freeze({
    CmsSignatureTagType: 0x704,
    PublicationRecordTagType: 0x703
});

export const AGGREGATION_HASH_CHAIN_CONSTANTS: AggregationHashChainConstants = Object.freeze({
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
        RequestTimeTagType: 0x4
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

export const LINK_DIRECTION_CONSTANTS: Readonly<{ Left: number; Right: number }> = Object.freeze({
    Left: 0x7,
    Right: 0x8
});
