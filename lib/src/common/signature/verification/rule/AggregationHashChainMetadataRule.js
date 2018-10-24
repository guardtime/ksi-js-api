var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HashAlgorithm } from 'gt-js-common';
import { AGGREGATION_HASH_CHAIN_CONSTANTS } from '../../../Constants';
import { TlvOutputStream } from '../../../parser/TlvOutputStream';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies if all metadata tags in aggregation hash chains are valid.
 */
export class AggregationHashChainMetadataRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = VerificationRule.getSignature(context);
            const aggregationHashChains = signature.getAggregationHashChains();
            for (const chain of aggregationHashChains) {
                for (const link of chain.getChainLinks()) {
                    const metadata = link.getMetadata();
                    if (metadata === null) {
                        continue;
                    }
                    const paddingTag = metadata.getPaddingTag();
                    if (paddingTag === null) {
                        const metadataBytes = metadata.getValueBytes();
                        if (metadataBytes.length === 0) {
                            continue;
                        }
                        const hashAlgorithmId = metadataBytes[0];
                        if (HashAlgorithm.isInvalidAlgorithm(hashAlgorithmId)) {
                            continue;
                        }
                        const hashAlgorithm = HashAlgorithm.getById(hashAlgorithmId);
                        if (hashAlgorithm !== null && hashAlgorithm.length === metadataBytes.length - 1) {
                            console.log(`Metadata without padding may not be trusted. Metadata: ${metadata}`);
                            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11);
                        }
                    }
                    else {
                        try {
                            if (metadata.value.indexOf(paddingTag) !== 0) {
                                throw new Error('Padding is not the first element.');
                            }
                            if (paddingTag.tlv16BitFlag) {
                                throw new Error('Padding is not TLV8.');
                            }
                            if (!paddingTag.nonCriticalFlag || !paddingTag.forwardFlag) {
                                throw new Error('Non-critical and forward flags must be set.');
                            }
                            const valueBytesString = JSON.stringify(paddingTag.getValueBytes());
                            if (valueBytesString !== JSON.stringify(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueEven)
                                && valueBytesString !== JSON.stringify(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd)) {
                                throw new Error('Unknown padding value.');
                            }
                            const stream = new TlvOutputStream();
                            stream.writeTag(metadata);
                            if (stream.getData().length % 2 !== 0) {
                                throw new Error('Invalid padding value.');
                            }
                        }
                        catch (error) {
                            console.log(`Metadata with padding may not be trusted. ${error.message} Metadata: ${metadata}`);
                            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11);
                        }
                    }
                }
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
