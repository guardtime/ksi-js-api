/**
 * TLV stream constants
 */
export const TLV_STREAM_CONSTANTS: Readonly<{ ForwardFlagBit: number; MaxType: number; NonCriticalFlagBit: number; Tlv16BitFlagBit: number; TypeMask: number }> =
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
export const CERTIFICATE_RECORD_CONSTANTS: Readonly<{ TagType: number; CertificateIdTagType: number; X509CertificateTagType: number }> = Object.freeze({
    TagType: 0x702,

    CertificateIdTagType: 0x1,
    X509CertificateTagType: 0x2
});

/**
 * Publication Data TLV constants
 */
export const PUBLICATION_DATA_CONSTANTS: Readonly<{ TagType: number; PublicationHashTagType: number; PublicationTimeTagType: number }> = Object.freeze({
    TagType: 0x10,

    PublicationHashTagType: 0x4,
    PublicationTimeTagType: 0x2
});

/**
 * Publication Record TLV constants
 */
export const PUBLICATION_RECORD_CONSTANTS: Readonly<{ PublicationReferencesTagType: number; PublicationRepositoryUriTagType: number }> = Object.freeze({
    PublicationReferencesTagType: 0x9,
    PublicationRepositoryUriTagType: 0xA
});

/**
 * Publications File Header TLV constants
 */
export const PUBLICATIONS_FILE_HEADER_CONSTANTS: Readonly<{ TagType: number; CreationTimeTagType: number; RepositoryUriTagType: number; VersionTagType: number }> = Object.freeze({
    TagType: 0x701,

    CreationTimeTagType: 0x2,
    RepositoryUriTagType: 0x3,
    VersionTagType: 0x1
});

/**
 * Publications File Constants
 */
export const PUBLICATIONS_FILE_CONSTANTS: Readonly<{ CmsSignatureTagType: number; PublicationRecordTagType: number }> = Object.freeze({
    CmsSignatureTagType: 0x704,
    PublicationRecordTagType: 0x703

});
