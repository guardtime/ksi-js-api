import {BigInteger} from 'big-integer';
import {DataHash, DataHasher, HashAlgorithm} from 'gt-js-common';
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
    private tstInfoAlgorithm: HashAlgorithm;
    private signedAttributesPrefix: RawTag;
    private signedAttributesSuffix: RawTag;
    private signedAttributesAlgorithm: HashAlgorithm;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public getInputHash(): DataHash {
        return this.inputHash.getValue();
    }

    public getTstInfoAlgorithm(): HashAlgorithm {
        return this.tstInfoAlgorithm;
    }

    public getSignedAttributesAlgorithm(): HashAlgorithm {
        return this.signedAttributesAlgorithm;
    }

    public getAggregationTime(): BigInteger {
        return this.aggregationTime.getValue();
    }

    /**
     * Get chain index values
     */
    public getChainIndex(): BigInteger[] {
        const result: BigInteger[] = [];
        for (const tag of this.chainIndexes) {
            result.push(tag.getValue());
        }

        return result;
    }

    public async getOutputHash(): Promise<DataHash> {
        let hasher: DataHasher = new DataHasher(this.tstInfoAlgorithm);
        hasher.update(this.tstInfoPrefix.getValue());
        hasher.update(this.inputHash.getValue().value);
        hasher.update(this.tstInfoSuffix.getValue());

        const inputHash: DataHash = await hasher.digest();

        hasher = new DataHasher(this.signedAttributesAlgorithm);
        hasher.update(this.signedAttributesPrefix.getValue());
        hasher.update(inputHash.value);
        hasher.update(this.signedAttributesSuffix.getValue());

        return hasher.digest();
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
                const tstInfoAlgorithm: HashAlgorithm | null = HashAlgorithm.getById(tstInfoAlgorithmTag.getValue().valueOf());
                if (tstInfoAlgorithm === null) {
                    throw new Error(`Invalid algorithm: ${tstInfoAlgorithmTag.getValue()}`);
                }

                this.tstInfoAlgorithm = tstInfoAlgorithm;

                return tstInfoAlgorithmTag;
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType:
                return this.signedAttributesPrefix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType:
                return this.signedAttributesSuffix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType:
                const signedAttributesAlgorithmTag: IntegerTag = new IntegerTag(tlvTag);
                const signedAttributesAlgorithm: HashAlgorithm | null =
                    HashAlgorithm.getById(signedAttributesAlgorithmTag.getValue().valueOf());

                if (signedAttributesAlgorithm === null) {
                    throw new Error(`Invalid algorithm: ${signedAttributesAlgorithmTag.getValue()}`);
                }

                this.signedAttributesAlgorithm = signedAttributesAlgorithm;

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
