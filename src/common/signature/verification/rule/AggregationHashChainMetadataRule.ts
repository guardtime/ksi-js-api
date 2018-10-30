import {HashAlgorithm} from 'gt-js-common';
import {AGGREGATION_HASH_CHAIN_CONSTANTS} from '../../../Constants';
import {RawTag} from '../../../parser/RawTag';
import {TlvOutputStream} from '../../../parser/TlvOutputStream';
import {AggregationHashChain, AggregationHashChainLinkMetaData} from '../../AggregationHashChain';
import {IKsiSignature} from '../../IKsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule verifies if all metadata tags in aggregation hash chains are valid.
 */
export class AggregationHashChainMetadataRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: IKsiSignature = VerificationRule.getSignature(context);
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        for (const chain of aggregationHashChains) {
            for (const link of chain.getChainLinks()) {
                const metadata: AggregationHashChainLinkMetaData | null = link.getMetadata();

                if (metadata === null) {
                    continue;
                }

                const paddingTag: RawTag | null = metadata.getPaddingTag();
                if (paddingTag === null) {
                    const metadataBytes: Uint8Array = metadata.getValueBytes();
                    if (metadataBytes.length === 0) {
                        continue;
                    }

                    const hashAlgorithmId: number = metadataBytes[0];
                    if (HashAlgorithm.isInvalidAlgorithm(hashAlgorithmId)) {
                        continue;
                    }

                    const hashAlgorithm: HashAlgorithm | null = HashAlgorithm.getById(hashAlgorithmId);
                    if (hashAlgorithm !== null && hashAlgorithm.length === metadataBytes.length - 1) {
                        console.log(`Metadata without padding may not be trusted. Metadata: ${metadata}`);

                        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11);
                    }
                } else {

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

                        const valueBytesString: string = JSON.stringify(paddingTag.getValueBytes());
                        if (valueBytesString !== JSON.stringify(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueEven)
                            && valueBytesString !== JSON.stringify(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd)) {
                            throw new Error('Unknown padding value.');
                        }

                        const stream: TlvOutputStream = new TlvOutputStream();
                        stream.writeTag(metadata);
                        if (stream.getData().length % 2 !== 0) {
                            throw new Error('Invalid padding value.');
                        }

                    } catch (error) {
                        console.log(`Metadata with padding may not be trusted. ${error.message} Metadata: ${metadata}`);

                        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_11);
                    }
                }
            }
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
