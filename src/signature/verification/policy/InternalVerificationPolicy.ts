import bigInteger, {BigInteger} from 'big-integer';
import {DataHash, DataHasher, HashAlgorithm} from 'gt-js-common';
import {LinkDirection} from '../../../Constants';
import {RawTag} from '../../../parser/RawTag';
import {TlvOutputStream} from '../../../parser/TlvOutputStream';
import {PublicationRecord} from '../../../publication/PublicationRecord';
import {AggregationHashChain, AggregationHashChainLinkMetaData, AggregationHashResult} from '../../AggregationHashChain';
import {CalendarAuthenticationRecord} from '../../CalendarAuthenticationRecord';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {Rfc3161Record} from '../../Rfc3161Record';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';
import {VerificationPolicy} from './VerificationPolicy';

class InputHashAlgorithmVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const documentHash: DataHash | null = context.getDocumentHash();

        if (documentHash === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const inputHash: DataHash = signature.getInputHash();

        if (documentHash.hashAlgorithm !== inputHash.hashAlgorithm) {
            // TODO: Turn off console logging
            console.log(`Wrong input hash algorithm. Expected ${documentHash.hashAlgorithm}, found ${inputHash.hashAlgorithm}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_04);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class DocumentHashVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const documentHash: DataHash | null = context.getDocumentHash();

        if (documentHash === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const inputHash: DataHash = signature.getInputHash();
        if (!documentHash.equals(inputHash)) {
            console.log(`Invalid document hash. Expected ${documentHash}, found ${inputHash}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_01);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class DocumentHashLevelVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const levelCorrection: bigInteger.BigInteger = signature.getRfc3161Record() !== null
            ? bigInteger(0)
            : signature.getAggregationHashChains()[0].getChainLinks()[0].getLevelCorrection();

        return context.getDocumentHashLevel() > levelCorrection
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_03)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class InputHashAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const inputHash: DataHash = signature.getInputHash();

        if (inputHash.hashAlgorithm.isDeprecated(signature.getAggregationTime().valueOf())) {
            console.log(`Input hash algorithm was deprecated at aggregation time. Algorithm: ${inputHash.hashAlgorithm.name}; Aggregation time: ${signature.getAggregationTime()}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_13);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class Rfc3161RecordHashAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (rfc3161Record === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        if (rfc3161Record.getTstInfoAlgorithm() != null
            && rfc3161Record.getTstInfoAlgorithm().isDeprecated(rfc3161Record.getAggregationTime().valueOf())) {

            console.log(`Hash algorithm used to hash the TSTInfo structure was deprecated at aggregation time.
                             Algorithm: ${rfc3161Record.getTstInfoAlgorithm().name};
                             Aggregation time: ${rfc3161Record.getAggregationTime()}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_14);
        }

        if (rfc3161Record.getSignedAttributesAlgorithm() != null
            && rfc3161Record.getSignedAttributesAlgorithm().isDeprecated(rfc3161Record.getAggregationTime().valueOf())) {

            console.log(`Hash algorithm used to hash the SignedAttributes structure was deprecated at aggregation time.
                             Algorithm: ${rfc3161Record.getSignedAttributesAlgorithm().name};
                             Aggregation time: ${rfc3161Record.getAggregationTime()}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_14);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class Rfc3161RecordOutputHashAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (signature.getRfc3161Record() === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChain: AggregationHashChain = signature.getAggregationHashChains()[0];
        const hashAlgorithm: HashAlgorithm = aggregationHashChain.getInputHash().hashAlgorithm;
        const aggregationTime: bigInteger.BigInteger = aggregationHashChain.getAggregationTime();

        if (hashAlgorithm.isDeprecated(aggregationTime.valueOf())) {
            console.log(`RFC3161 output hash algorithm was deprecated at aggregation time.
                         Algorithm: ${hashAlgorithm};
                         Aggregation time: ${aggregationTime}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_17);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class Rfc3161RecordChainIndexRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (rfc3161Record === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChains: Readonly<AggregationHashChain[]> = signature.getAggregationHashChains();
        const rfc3161ChainIndex: bigInteger.BigInteger[] = rfc3161Record.getChainIndex();
        const aggregationChainIndex: bigInteger.BigInteger[] = aggregationHashChains[0].getChainIndex();

        const rfc3161ChainIndexJson: string = JSON.stringify(rfc3161ChainIndex);
        const aggregationChainIndexJson: string = JSON.stringify(aggregationChainIndex);
        if (rfc3161ChainIndexJson !== aggregationChainIndexJson) {
            console.log(`Aggregation hash chain index and RFC3161 chain index mismatch.
                         Aggregation chain index ${rfc3161ChainIndexJson} and RFC3161 chain index is ${aggregationChainIndexJson}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class Rfc3161RecordOutputHashVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (rfc3161Record === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChainInputHash: DataHash = signature.getAggregationHashChains()[0].getInputHash();
        const inputHash: DataHash = await new DataHasher(aggregationHashChainInputHash.hashAlgorithm)
            .update((await rfc3161Record.getOutputHash()).imprint)
            .digest();

        return !inputHash.equals(aggregationHashChainInputHash)
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class Rfc3161RecordAggregationTimeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (rfc3161Record === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChains: Readonly<AggregationHashChain[]> = signature.getAggregationHashChains();
        if (aggregationHashChains[0].getAggregationTime().equals(rfc3161Record.getAggregationTime())) {
            console.log(`Aggregation hash chain aggregation time and RFC 3161 aggregation time mismatch.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_02);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class AggregationHashChainIndexSuccessorRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        let parentChainIndex: BigInteger[] | null = null;
        let chainIndex: BigInteger[] | null = null;

        for (const chain of aggregationHashChains) {
            chainIndex = chain.getChainIndex();
            if (parentChainIndex !== null && !(parentChainIndex.length !== chainIndex.length
                || JSON.stringify(parentChainIndex).startsWith(JSON.stringify(chainIndex)))) {

                console.log(`Chain index is not the successor to the parent aggregation hash chain index.
                            Chain index: ${chainIndex};
                            Parent chain index: ${parentChainIndex}`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12);
            }

            parentChainIndex = chainIndex;
        }

        if (aggregationHashChains[aggregationHashChains.length - 1].getChainIndex().length !== 1) {
            console.log(`Highest aggregation hash chain index length is not 1. Chain index: ${chainIndex};`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class AggregationHashChainMetadataRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
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
                        if (valueBytesString !== JSON.stringify([0x0, 0x0]) && valueBytesString !== JSON.stringify([0x0])) {
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

class AggregationHashChainAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        for (const chain of aggregationHashChains) {
            if (chain.getAggregationAlgorithm().isDeprecated(chain.getAggregationTime().valueOf())) {
                console.log(`Aggregation hash chain aggregation algorithm was deprecated at aggregation time.
                             Algorithm: ${chain.getAggregationAlgorithm().name};
                             Aggregation time: ${chain.getAggregationTime()}`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_15);
            }
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class AggregationHashChainConsistencyRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        let chainHashResult: AggregationHashResult | null = null;
        for (const chain of aggregationHashChains) {
            if (chainHashResult === null) {
                chainHashResult = {level: bigInteger(0), hash: chain.getInputHash()};
            }

            if (!chain.getInputHash().equals(chainHashResult.hash)) {
                console.log(`Aggregation hash chains not consistent.
                             Aggregation hash chain input hash ${chain.getInputHash()} does not match previous
                             aggregation hash chain output hash ${chainHashResult.hash}.`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01);
            }

            chainHashResult = await chain.getOutputHash(chainHashResult);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class AggregationHashChainTimeConsistencyRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        let time: bigInteger.BigInteger | null = null;
        for (const chain of aggregationHashChains) {
            if (time === null) {
                time = chain.getAggregationTime();
            }

            if (!chain.getAggregationTime().equals(time)) {
                console.log(`Previous aggregation hash chain aggregation time ${time} does not match
                             current aggregation time ${chain.getAggregationTime()}.`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_02);
            }

        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class AggregationHashChainShapeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        for (const chain of aggregationHashChains) {
            const chainIndex: BigInteger[] = chain.getChainIndex();
            const calculatedValue: BigInteger = chain.calculateLocationPointer();
            const lastIndexValue: BigInteger = chainIndex[chainIndex.length - 1];

            if (!lastIndexValue.eq(calculatedValue)) {
                console.log(`The shape of the aggregation hash chain does not match with the chain index.
                              Calculated location pointer: ${calculatedValue}; Value in chain: ${lastIndexValue}`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_10);
            }

        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class CalendarHashChainExistenceRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return VerificationRule.getSignature(context).getCalendarHashChain() === null
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class CalendarHashChainInputHashVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        return !(await signature.getLastAggregationHashChainRootHash()).equals(calendarHashChain.getInputHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_03)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class CalendarHashChainAggregationTimeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        return aggregationHashChains[aggregationHashChains.length - 1].getAggregationTime().neq(calendarHashChain.getAggregationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_04)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class CalendarHashChainAlgorithmObsoleteRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        for (const link of calendarHashChain.getChainLinks()) {
            if (link.id !== LinkDirection.Left) {
                continue;
            }

            if (link.getValue().hashAlgorithm.isObsolete(calendarHashChain.getPublicationTime().valueOf())) {
                console.log(`Calendar hash chain contains obsolete aggregation algorithm at publication time.
                             Algorithm: ${link.getValue().hashAlgorithm.name};
                             Publication time: ${calendarHashChain.getPublicationTime()}`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_16);
            }
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class CalendarHashChainRegistrationTimeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        return calendarHashChain.getAggregationTime().neq(calendarHashChain.calculateRegistrationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_05)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class CalendarAuthenticationRecordExistenceRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return VerificationRule.getSignature(context).getCalendarAuthenticationRecord() === null
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class CalendarAuthenticationRecordPublicationTimeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

        if (calendarAuthenticationRecord == null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (calendarHashChain === null) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }

        return calendarHashChain.getPublicationTime().neq(calendarAuthenticationRecord.getPublicationData().getPublicationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_06)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class CalendarAuthenticationRecordAggregationHashRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

        if (calendarAuthenticationRecord == null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (calendarHashChain === null) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }

        return !(await calendarHashChain.calculateOutputHash())
            .equals(calendarAuthenticationRecord.getPublicationData().getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_08)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class SignaturePublicationRecordExistenceRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return VerificationRule.getSignature(context).getPublicationRecord() === null
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class SignaturePublicationRecordPublicationTimeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();

        if (publicationRecord === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (calendarHashChain === null) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }

        return publicationRecord.getPublicationTime().neq(calendarHashChain.getPublicationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_07)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class SignaturePublicationRecordPublicationHashRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();

        if (publicationRecord === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (calendarHashChain === null) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }

        return publicationRecord.getPublicationHash().equals(calendarHashChain.calculateOutputHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_09)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

class SuccessResultRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}

/**
 * Policy for verifying KSI signature internal consistency.
 */
export class InternalVerificationPolicy extends VerificationPolicy {
    constructor() {
        super(InternalVerificationPolicy.verifyInput()
            .onSuccess(InternalVerificationPolicy.verifyRfc3161()
                .onSuccess(InternalVerificationPolicy.verifyAggregationChain()
                    .onSuccess(
                        // Verify calendar hash chain if exists
                        new CalendarHashChainExistenceRule() // Gen-02
                            .onSuccess(
                                InternalVerificationPolicy.verifyCalendarChain()
                                    .onSuccess(
                                        // Verify calendar auth record if exists
                                        new CalendarAuthenticationRecordExistenceRule() // Gen-02
                                            .onSuccess(new CalendarAuthenticationRecordPublicationTimeRule() // Int-06
                                                .onSuccess(new CalendarAuthenticationRecordAggregationHashRule()))
                                            // No calendar auth record. Verify publication record.
                                            .onNa(new SignaturePublicationRecordExistenceRule() // Gen-02
                                                .onSuccess(new SignaturePublicationRecordPublicationTimeRule() // Int-07
                                                    .onSuccess(new SignaturePublicationRecordPublicationHashRule())) // Int-09
                                                // No publication record
                                                .onNa(new SuccessResultRule())))))
                    // No calendar hash chain
                    .onNa(new SuccessResultRule()))));
    }

    private static verifyInput(): VerificationRule {
        return new VerificationPolicy(
            new InputHashAlgorithmVerificationRule() // Gen-04
                .onSuccess(new DocumentHashVerificationRule() // Gen-01
                    .onSuccess(new DocumentHashLevelVerificationRule() // Gen-03
                        .onSuccess(new InputHashAlgorithmDeprecatedRule())))); // Int-13)
    }

    private static verifyRfc3161(): VerificationRule {
        return new VerificationPolicy(
            new Rfc3161RecordHashAlgorithmDeprecatedRule() // Int-14
                .onSuccess(new Rfc3161RecordOutputHashAlgorithmDeprecatedRule() // Int-17
                    .onSuccess(new Rfc3161RecordChainIndexRule() // Int-12
                        .onSuccess(new Rfc3161RecordOutputHashVerificationRule() // Int-01
                            .onSuccess(new Rfc3161RecordAggregationTimeRule()))))); // Int-02
    }

    private static verifyAggregationChain(): VerificationRule {
        return new VerificationPolicy(new AggregationHashChainIndexSuccessorRule() // Int-12
            .onSuccess(new AggregationHashChainMetadataRule() // Int-11
                .onSuccess(new AggregationHashChainAlgorithmDeprecatedRule() // Int-15
                    .onSuccess(new AggregationHashChainConsistencyRule() // Int-01
                        .onSuccess(new AggregationHashChainTimeConsistencyRule() // Int-02
                            .onSuccess(new AggregationHashChainShapeRule())))))); // Int-10
    }

    private static verifyCalendarChain(): VerificationRule {
        return new VerificationPolicy(new CalendarHashChainInputHashVerificationRule() // Int-03
            .onSuccess(new CalendarHashChainAggregationTimeRule() // Int-04
                .onSuccess(new CalendarHashChainRegistrationTimeRule() // Int-05
                    .onSuccess(new CalendarHashChainAlgorithmObsoleteRule())))); // Int-16 // Int-10
    }
}
