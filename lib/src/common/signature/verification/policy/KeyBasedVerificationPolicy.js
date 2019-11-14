import { CalendarAuthenticationRecordExistenceRule } from '../rule/CalendarAuthenticationRecordExistenceRule';
import { CalendarAuthenticationRecordSignatureVerificationRule } from '../rule/CalendarAuthenticationRecordSignatureVerificationRule';
import { CalendarHashChainAlgorithmDeprecatedRule } from '../rule/CalendarHashChainAlgorithmDeprecatedRule';
import { CalendarHashChainExistenceRule } from '../rule/CalendarHashChainExistenceRule';
import { CertificateExistenceRule } from '../rule/CertificateExistenceRule';
import { InternalVerificationPolicy } from './InternalVerificationPolicy';
import { VerificationPolicy } from './VerificationPolicy';
/**
 * Policy for verifying KSI signature with PKI.
 */
export class KeyBasedVerificationPolicy extends VerificationPolicy {
    constructor(skipInternalVerification = false) {
        let verificationRule = new CalendarHashChainExistenceRule() // Gen-02
            .onSuccess(new CalendarHashChainAlgorithmDeprecatedRule() // Gen-02
            .onSuccess(new CalendarAuthenticationRecordExistenceRule() // Gen-02
            .onSuccess(new CertificateExistenceRule() // Key-01
            .onSuccess(new CalendarAuthenticationRecordSignatureVerificationRule())))); // Key-02, Key-03
        if (!skipInternalVerification) {
            verificationRule = new InternalVerificationPolicy().onSuccess(verificationRule);
        }
        super(verificationRule);
    }
}
