import {HashAlgorithm} from 'gt-js-common';
import {RFC_3161_RECORD_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {RawTag} from '../parser/RawTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * RFC 3161 Record TLV Object
 */
export class Rfc3161Record extends CompositeTag {
    private aggregationTime: IntegerTag;
    private chainIndexes: IntegerTag[] = [];
    private inputHash: ImprintTag;
    private tstInfoPrefix: RawTag;
    private tstInfoSuffix: RawTag;
    private tstInfoAlgorithm: HashAlgorithm | null;
    private signedAttributesPrefix: RawTag;
    private signedAttributesSuffix: RawTag;
    private signedAttributesAlgorithm: HashAlgorithm | null;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    private parseChild(tlvTag: TlvTag): TlvTag {

        switch (tlvTag.id) {
            case RFC_3161_RECORD_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.ChainIndexTagType:
                const chainIndexTag: IntegerTag = new IntegerTag(tlvTag);
                this.chainIndexes.push(chainIndexTag);

                return chainIndexTag;
            case RFC_3161_RECORD_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.TstInfoPrefixTagType:
                return this.tstInfoPrefix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.TstInfoSuffixTagType:
                return this.tstInfoSuffix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.TstInfoAlgorithmTagType:
                // TODO: Better solution
                const tstInfoAlgorithmTag: IntegerTag = new IntegerTag(tlvTag);
                this.tstInfoAlgorithm = HashAlgorithm.getById(tstInfoAlgorithmTag.getValue().valueOf());

                return tstInfoAlgorithmTag;
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType:
                return this.signedAttributesPrefix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType:
                return this.signedAttributesSuffix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType:
                const signedAttributesAlgorithmTag: IntegerTag = new IntegerTag(tlvTag);
                this.signedAttributesAlgorithm = HashAlgorithm.getById(signedAttributesAlgorithmTag.getValue().valueOf());

                return signedAttributesAlgorithmTag;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[RFC_3161_RECORD_CONSTANTS.AggregationTimeTagType] !== 1) {
            throw new TlvError('Exactly one aggregation time must exist in RFC#3161 record.');
        }

        if (this.chainIndexes.length === 0) {
            throw new TlvError('Chain indexes must exist in RFC#3161 record.');
        }

        if (tagCount[RFC_3161_RECORD_CONSTANTS.InputHashTagType] !== 1) {
            throw new TlvError('Exactly one input hash must exist in RFC#3161 record.');
        }

        if (tagCount[RFC_3161_RECORD_CONSTANTS.TstInfoPrefixTagType] !== 1) {
            throw new TlvError('Exactly one tstInfo prefix must exist in RFC#3161 record.');
        }

        if (tagCount[RFC_3161_RECORD_CONSTANTS.TstInfoSuffixTagType] !== 1) {
            throw new TlvError('Exactly one tstInfo suffix must exist in RFC#3161 record.');
        }

        if (tagCount[RFC_3161_RECORD_CONSTANTS.TstInfoAlgorithmTagType] !== 1) {
            throw new TlvError('Exactly one tstInfo algorithm must exist in RFC#3161 record.');
        }

        if (this.tstInfoAlgorithm === null) {
            throw new TlvError('Invalid tstInfo algorithm value in RFC#3161 record.');
        }

        if (tagCount[RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType] !== 1) {
            throw new TlvError('Exactly one signed attributes prefix must exist in RFC#3161 record.');
        }

        if (tagCount[RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType] !== 1) {
            throw new TlvError('Exactly one signed attributes suffix must exist in RFC#3161 record.');
        }

        if (tagCount[RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType] !== 1) {
            throw new TlvError('Exactly one signed attributes algorithm must exist in RFC#3161 record.');
        }

        if (this.signedAttributesAlgorithm === null) {
            throw new TlvError('Invalid signed attributes algorithm value in RFC#3161 record.');
        }
    }
}
