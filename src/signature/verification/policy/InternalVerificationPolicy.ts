import bigInteger from 'big-integer';
import {DataHash, DataHasher, HashAlgorithm} from 'gt-js-common';
import {AggregationHashChain} from '../../AggregationHashChain';
import {KsiSignature} from '../../KsiSignature';
import {Rfc3161Record} from '../../Rfc3161Record';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';
import {VerificationPolicy} from './VerificationPolicy';

class InputHashAlgorithmVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const documentHash: DataHash = context.getDocumentHash();

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
        const documentHash: DataHash = context.getDocumentHash();

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

        if (inputHash.hashAlgorithm.isDeprecated(signature.getAggregationTime())) {
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
            && rfc3161Record.getTstInfoAlgorithm().isDeprecated(rfc3161Record.getAggregationTime())) {

            console.log(`Hash algorithm used to hash the TSTInfo structure was deprecated at aggregation time.
                             Algorithm: ${rfc3161Record.getTstInfoAlgorithm().name};
                             Aggregation time: ${rfc3161Record.getAggregationTime()}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_14);
        }

        if (rfc3161Record.getSignedAttributesAlgorithm() != null
            && rfc3161Record.getSignedAttributesAlgorithm().isDeprecated(rfc3161Record.getAggregationTime())) {

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

        if (hashAlgorithm.isDeprecated(aggregationTime)) {
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

        let parentChainIndex: string | null = null;
        let chainIndex: string = '';
        for (const chain of aggregationHashChains) {
            chainIndex = JSON.stringify(chain.getChainIndex());
            if (parentChainIndex !== null && !(chainIndex.length > parentChainIndex.length && chainIndex.startsWith(parentChainIndex))) {
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

    }
}
class AggregationHashChainAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {

    }
}
class AggregationHashChainConsistencyRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {

    }
}
class AggregationHashChainTimeConsistencyRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {

    }
}
class AggregationHashChainShapeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {

    }
}

/**
 * Policy for verifying KSI signature internal consistency.
 */
export class InternalVerificationPolicy extends VerificationPolicy {
    constructor() {
        super(InternalVerificationPolicy.verifyInput()
            .onSuccess(InternalVerificationPolicy.verifyRfc3161()
                .onSuccess(InternalVerificationPolicy.verifyAggregationChain())));

        // // Verify calendar hash chain if exists
        // new CalendarHashChainExistenceRule() // Gen-02
        //     .OnSuccess(GetCalendarChainRules(
        //         // Verify calendar auth record if exists
        //         new CalendarAuthenticationRecordExistenceRule() // Gen-02
        //             .OnSuccess(CalendarAuthRecordRules)
        //             // No calendar auth record. Verify publication record.
        //             .OnNa(PublicationRules)))
        //     // No calendar hash chain
        //     .OnNa(new OkResultRule()))));
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
}
