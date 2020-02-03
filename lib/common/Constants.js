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
        PaddingKnownValueOdd: new Uint8Array([0x1])
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
export const PUBLICATIONS_FILE_SIGNATURE_CONSTANTS = Object.freeze({
    TrustedCertificates: "-----BEGIN CERTIFICATE-----\n" +
        "MIIFgzCCA2ugAwIBAgIORea7A4Mzw4VlSOb/RVEwDQYJKoZIhvcNAQEMBQAwTDEg\n" +
        "MB4GA1UECxMXR2xvYmFsU2lnbiBSb290IENBIC0gUjYxEzARBgNVBAoTCkdsb2Jh\n" +
        "bFNpZ24xEzARBgNVBAMTCkdsb2JhbFNpZ24wHhcNMTQxMjEwMDAwMDAwWhcNMzQx\n" +
        "MjEwMDAwMDAwWjBMMSAwHgYDVQQLExdHbG9iYWxTaWduIFJvb3QgQ0EgLSBSNjET\n" +
        "MBEGA1UEChMKR2xvYmFsU2lnbjETMBEGA1UEAxMKR2xvYmFsU2lnbjCCAiIwDQYJ\n" +
        "KoZIhvcNAQEBBQADggIPADCCAgoCggIBAJUH6HPKZvnsFMp7PPcNCPG0RQssgrRI\n" +
        "xutbPK6DuEGSMxSkb3/pKszGsIhrxbaJ0cay/xTOURQh7ErdG1rG1ofuTToVBu1k\n" +
        "ZguSgMpE3nOUTvOniX9PeGMIyBJQbUJmL025eShNUhqKGoC3GYEOfsSKvGRMIRxD\n" +
        "aNc9PIrFsmbVkJq3MQbFvuJtMgamHvm566qjuL++gmNQ0PAYid/kD3n16qIfKtJw\n" +
        "LnvnvJO7bVPiSHyMEAc4/2ayd2F+4OqMPKq0pPbzlUoSB239jLKJz9CgYXfIWHSw\n" +
        "1CM69106yqLbnQneXUQtkPGBzVeS+n68UARjNN9rkxi+azayOeSsJDa38O+2HBNX\n" +
        "k7besvjihbdzorg1qkXy4J02oW9UivFyVm4uiMVRQkQVlO6jxTiWm05OWgtH8wY2\n" +
        "SXcwvHE35absIQh1/OZhFj931dmRl4QKbNQCTXTAFO39OfuD8l4UoQSwC+n+7o/h\n" +
        "bguyCLNhZglqsQY6ZZZZwPA1/cnaKI0aEYdwgQqomnUdnjqGBQCe24DWJfncBZ4n\n" +
        "WUx2OVvq+aWh2IMP0f/fMBH5hc8zSPXKbWQULHpYT9NLCEnFlWQaYw55PfWzjMpY\n" +
        "rZxCRXluDocZXFSxZba/jJvcE+kNb7gu3GduyYsRtYQUigAZcIN5kZeR1Bonvzce\n" +
        "MgfYFGM8KEyvAgMBAAGjYzBhMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8EBTAD\n" +
        "AQH/MB0GA1UdDgQWBBSubAWjkxPioufi1xzWx/B/yGdToDAfBgNVHSMEGDAWgBSu\n" +
        "bAWjkxPioufi1xzWx/B/yGdToDANBgkqhkiG9w0BAQwFAAOCAgEAgyXt6NH9lVLN\n" +
        "nsAEoJFp5lzQhN7craJP6Ed41mWYqVuoPId8AorRbrcWc+ZfwFSY1XS+wc3iEZGt\n" +
        "Ixg93eFyRJa0lV7Ae46ZeBZDE1ZXs6KzO7V33EByrKPrmzU+sQghoefEQzd5Mr61\n" +
        "55wsTLxDKZmOMNOsIeDjHfrYBzN2VAAiKrlNIC5waNrlU/yDXNOd8v9EDERm8tLj\n" +
        "vUYAGm0CuiVdjaExUd1URhxN25mW7xocBFymFe944Hn+Xds+qkxV/ZoVqW/hpvvf\n" +
        "cDDpw+5CRu3CkwWJ+n1jez/QcYF8AOiYrg54NMMl+68KnyBr3TsTjxKM4kEaSHpz\n" +
        "oHdpx7Zcf4LIHv5YGygrqGytXm3ABdJ7t+uA/iU3/gKbaKxCXcPu9czc8FB10jZp\n" +
        "nOZ7BN9uBmm23goJSFmH63sUYHpkqmlD75HHTOwY3WzvUy2MmeFe8nI+z1TIvWfs\n" +
        "pA9MRf/TuTAjB0yPEL+GltmZWrSZVxykzLsViVO6LAUP5MSeGbEYNNVMnbrt9x+v\n" +
        "JJUEeKgDu+6B5dpffItKoZB0JaezPkvILFa9x8jvOOJckvB595yEunQtYQEgfn7R\n" +
        "8k8HWV+LLUNS60YMlOH1Zkd5d9VUWx+tJDfLRVpOoERIyNiwmcUVhAn21klJwGW4\n" +
        "5hpxbqCo8YLoRT5s1gLXCmeDBVrJpBA=\n" +
        "-----END CERTIFICATE-----\n" +
        "-----BEGIN CERTIFICATE-----\n" +
        "MIIFYDCCA0igAwIBAgIQCgFCgAAAAUUjyES1AAAAAjANBgkqhkiG9w0BAQsFADBK\n" +
        "MQswCQYDVQQGEwJVUzESMBAGA1UEChMJSWRlblRydXN0MScwJQYDVQQDEx5JZGVu\n" +
        "VHJ1c3QgQ29tbWVyY2lhbCBSb290IENBIDEwHhcNMTQwMTE2MTgxMjIzWhcNMzQw\n" +
        "MTE2MTgxMjIzWjBKMQswCQYDVQQGEwJVUzESMBAGA1UEChMJSWRlblRydXN0MScw\n" +
        "JQYDVQQDEx5JZGVuVHJ1c3QgQ29tbWVyY2lhbCBSb290IENBIDEwggIiMA0GCSqG\n" +
        "SIb3DQEBAQUAA4ICDwAwggIKAoICAQCnUBneP5k91DNG8W9RYYKyqU+PZ4ldhNlT\n" +
        "3Qwo2dfw/66VQ3KZ+bVdfIrBQuExUHTRgQ18zZshq0PirK1ehm7zCYofWjK9ouuU\n" +
        "+ehcCuz/mNKvcbO0U59Oh++SvL3sTzIwiEsXXlfEU8L2ApeN2WIrvyQfYo3fw7gp\n" +
        "S0l4PJNgiCL8mdo2yMKi1CxUAGc1bnO/AljwpN3lsKImesrgNqUZFvX9t++uP0D1\n" +
        "bVoE/c40yiTcdCMbXTMTEl3EASX2MN0CXZ/g1Ue9tOsbobtJSdifWwLziuQkkORi\n" +
        "T0/Br4sOdBeo0XKIanoBScy0RnnGF7HamB4HWfp1IYVl3ZBWzvurpWCdxJ35UrCL\n" +
        "vYf5jysjCiN2O/cz4ckA82n5S6LgTrx+kzmEB/dEcH7+B1rlsazRGMzyNeVJSQjK\n" +
        "Vsk9+w8YfYs7wRPCTY/JTw436R+hDmrfYi7LNQZReSzIJTj0+kuniVyc0uMNOYZK\n" +
        "dHzVWYfCP04MXFL0PfdSgvHqo6z9STQaKPNBiDoT7uje/5kdX7rL6B7yuVBgwDHT\n" +
        "c+XvvqDtMwt0viAgxGds8AgDelWAf0ZOlqf0Hj7h9tgJ4TNkK2PXMl6f+cB7D3hv\n" +
        "l7yTmvmcEpB4eoCHFddydJxVdHixuuFucAS6T6C6aMN7/zHwcz09lCqxC0EOoP5N\n" +
        "iGVreTO01wIDAQABo0IwQDAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB\n" +
        "/zAdBgNVHQ4EFgQU7UQZwNPwBovupHu+QucmVMiONnYwDQYJKoZIhvcNAQELBQAD\n" +
        "ggIBAA2ukDL2pkt8RHYZYR4nKM1eVO8lvOMIkPkp165oCOGUAFjvLi5+U1KMtlwH\n" +
        "6oi6mYtQlNeCgN9hCQCTrQ0U5s7B8jeUeLBfnLOic7iPBZM4zY0+sLj7wM+x8uwt\n" +
        "LRvM7Kqas6pgghstO8OEPVeKlh6cdbjTMM1gCIOQ045U8U1mwF10A0Cj7oV+wh93\n" +
        "nAbowacYXVKV7cndJZ5t+qntozo00Fl72u1Q8zW/7esUTTHHYPTa8Yec4kjixsU3\n" +
        "+wYQ+nVZZjFHKdp2mhzpgq7vmrlR94gjmmmVYjzlVYA211QC//G5Xc7UI2/YRYRK\n" +
        "W2XviQzdFKcgyxilJbQN+QHwotL0AMh0jqEqSI5l2xPE4iUXfeu+h1sXIFRRk0pT\n" +
        "AwvsXcoz7WL9RccvW9xYoIA55vrX/hMUpu09lEpCdNTDd1lzzY9GvlU47/rokTLq\n" +
        "l1gEIt44w8y8bckzOmoKaT+gyOpyj4xjhiO9bTyWnpXgSUyqorkqG5w2gXjtw+hG\n" +
        "4iZZRHUe2XWJUc0QhJ1hYMtd+ZciTY6Y5uN/9lu7rs3KSoFrXgvzUeF0K+l+J6fZ\n" +
        "mUlO+KWA2yUPHGNiiskzZ2s8EIPGrd6ozRaOjfAHN3Gf8qv8QfXBi+wAN10J5U6A\n" +
        "7/qxXDgGpRtK4dw4LTzcqx+QGtVKnO7RcGzM7vRX+Bi6hG6H\n" +
        "-----END CERTIFICATE-----\n",
    GuardtimeSignatureSubjectEmail: "E=publications@guardtime.com"
});
