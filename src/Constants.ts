export const TlvStreamConstants = {
    ForwardFlagBit: 0b00100000,
    MaxType: 0x1fff,
    NonCriticalFlagBit: 0b01000000,
    Tlv16BitFlagBit: 0b10000000,
    TypeMask: 0b00011111,
};

export const CertificateRecordConstants = {
    TagType: 0x702,

    CertificateIdTagType: 0x1,
    X509CertificateTagType: 0x2,
};

export const PublicationDataConstants = {
    TagType: 0x10,

    PublicationHashTagType: 0x4,
    PublicationTimeTagType: 0x2,
};

export const PublicationRecordConstants = {
    PublicationReferencesTagType: 0x9,
    PublicationRepositoryUriTagType: 0xa,
};

export const PublicationsFileHeaderConstants = {
    TagType: 0x701,

    CreationTimeTagType: 0x2,
    RepositoryUriTagType: 0x3,
    VersionTagType: 0x1,
};

export const PublicationsFileConstants = {
    CmsSignatureTagType: 0x704,
    PublicationRecordTagType: 0x703,

};
