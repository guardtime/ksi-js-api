import {CalendarAuthenticationRecordExistenceRule} from '../rule/CalendarAuthenticationRecordExistenceRule';
import {CalendarHashChainExistenceRule} from '../rule/CalendarHashChainExistenceRule';
import {InternalVerificationPolicy} from './InternalVerificationPolicy';
import {VerificationPolicy} from './VerificationPolicy';
import {VerificationRule} from '../VerificationRule';
import {VerificationContext} from '../VerificationContext';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationError} from '../VerificationError';
import {KsiSignature} from '../../KsiSignature';
import {CalendarHashChain} from '../../CalendarHashChain';
import {LinkDirection} from '../../../Constants';

/**
 * Verifies that calendar hash chain right link hash algorithms were not deprecated at the publication time.
 * If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        for (const link of calendarHashChain.getChainLinks()) {
            if (link.id === LinkDirection.Left) 
        }

                HashAlgorithm deprecatedHashAlgorithm = GetDeprecatedHashAlgorithm(calendarHashChain);

        if (deprecatedHashAlgorithm != null)
        {
            Logger.Debug("Calendar hash chain contains deprecated aggregation algorithm at publication time. Algorithm: {0}; Publication time: {1}",
                deprecatedHashAlgorithm.Name, calendarHashChain.PublicationTime);
            return new VerificationResult(GetRuleName(), VerificationResultCode.Na, VerificationError.Gen02);
        }

        return new VerificationResult(GetRuleName(), VerificationResultCode.Ok);
    }
}

/**
 * Policy for verifying KSI signature with PKI.
 */
export class KeyBasedVerificationPolicy extends VerificationPolicy {

    constructor() {
        super(new InternalVerificationPolicy()
            .onSuccess(new CalendarHashChainExistenceRule() // Gen-02
                .onSuccess(new CalendarHashChainAlgorithmDeprecatedRule() // Gen-02
                    .onSuccess(new CalendarAuthenticationRecordExistenceRule() // Gen-02
                        .onSuccess(new CertificateExistenceRule() // Key-01
                            .onSuccess(new CalendarAuthenticationRecordSignatureVerificationRule())))); // Key-02, Key-03));
    }
}
