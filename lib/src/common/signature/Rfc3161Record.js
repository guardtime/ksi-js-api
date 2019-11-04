var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataHasher, HashAlgorithm } from '@guardtime/gt-js-common';
import { RFC_3161_RECORD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { RawTag } from '../parser/RawTag';
import { TlvError } from '../parser/TlvError';
/**
 * RFC 3161 Record TLV Object
 */
export class Rfc3161Record extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.chainIndexes = [];
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getInputHash() {
        return this.inputHash.getValue();
    }
    getTstInfoAlgorithm() {
        return this.tstInfoAlgorithm;
    }
    getSignedAttributesAlgorithm() {
        return this.signedAttributesAlgorithm;
    }
    getAggregationTime() {
        return this.aggregationTime.getValue();
    }
    /**
     * Get chain index values
     */
    getChainIndex() {
        const result = [];
        for (const tag of this.chainIndexes) {
            result.push(tag.getValue());
        }
        return result;
    }
    getOutputHash() {
        return __awaiter(this, void 0, void 0, function* () {
            let hasher = new DataHasher(this.tstInfoAlgorithm);
            hasher.update(this.tstInfoPrefix.getValue());
            hasher.update(this.inputHash.getValue().value);
            hasher.update(this.tstInfoSuffix.getValue());
            const inputHash = yield hasher.digest();
            hasher = new DataHasher(this.signedAttributesAlgorithm);
            hasher.update(this.signedAttributesPrefix.getValue());
            hasher.update(inputHash.value);
            hasher.update(this.signedAttributesSuffix.getValue());
            return hasher.digest();
        });
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case RFC_3161_RECORD_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.ChainIndexTagType:
                const chainIndexTag = new IntegerTag(tlvTag);
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
                const tstInfoAlgorithmTag = new IntegerTag(tlvTag);
                const tstInfoAlgorithm = HashAlgorithm.getById(tstInfoAlgorithmTag.getValue().valueOf());
                if (tstInfoAlgorithm === null) {
                    throw new Error(`Invalid algorithm: ${tstInfoAlgorithmTag.getValue()}.`);
                }
                this.tstInfoAlgorithm = tstInfoAlgorithm;
                return tstInfoAlgorithmTag;
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType:
                return this.signedAttributesPrefix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType:
                return this.signedAttributesSuffix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType:
                const signedAttributesAlgorithmTag = new IntegerTag(tlvTag);
                const signedAttributesAlgorithm = HashAlgorithm.getById(signedAttributesAlgorithmTag.getValue().valueOf());
                if (signedAttributesAlgorithm === null) {
                    throw new Error(`Invalid algorithm: ${signedAttributesAlgorithmTag.getValue()}.`);
                }
                this.signedAttributesAlgorithm = signedAttributesAlgorithm;
                return signedAttributesAlgorithmTag;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.AggregationTimeTagType) !== 1) {
            throw new TlvError('Exactly one aggregation time must exist in RFC#3161 record.');
        }
        if (this.chainIndexes.length === 0) {
            throw new TlvError('Chain indexes must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.InputHashTagType) !== 1) {
            throw new TlvError('Exactly one input hash must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoPrefixTagType) !== 1) {
            throw new TlvError('Exactly one tstInfo prefix must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoSuffixTagType) !== 1) {
            throw new TlvError('Exactly one tstInfo suffix must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoAlgorithmTagType) !== 1) {
            throw new TlvError('Exactly one tstInfo algorithm must exist in RFC#3161 record.');
        }
        if (this.tstInfoAlgorithm === null) {
            throw new TlvError('Invalid tstInfo algorithm value in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType) !== 1) {
            throw new TlvError('Exactly one signed attributes prefix must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType) !== 1) {
            throw new TlvError('Exactly one signed attributes suffix must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType) !== 1) {
            throw new TlvError('Exactly one signed attributes algorithm must exist in RFC#3161 record.');
        }
        if (this.signedAttributesAlgorithm === null) {
            throw new TlvError('Invalid signed attributes algorithm value in RFC#3161 record.');
        }
    }
}
