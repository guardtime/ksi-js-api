import { CalendarHashChainAlgorithmDeprecatedRule } from '../rule/CalendarHashChainAlgorithmDeprecatedRule';
import { ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule } from '../rule/ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule';
import { ExtendingPermittedVerificationRule } from '../rule/ExtendingPermittedVerificationRule';
import { SignaturePublicationRecordExistenceRule } from '../rule/SignaturePublicationRecordExistenceRule';
import { UserProvidedPublicationCreationTimeVerificationRule } from '../rule/UserProvidedPublicationCreationTimeVerificationRule';
import { UserProvidedPublicationExistenceRule } from '../rule/UserProvidedPublicationExistenceRule';
import { UserProvidedPublicationExtendedSignatureInputHashRule } from '../rule/UserProvidedPublicationExtendedSignatureInputHashRule';
import { UserProvidedPublicationHashMatchesExtendedResponseRule } from '../rule/UserProvidedPublicationHashMatchesExtendedResponseRule';
import { UserProvidedPublicationTimeMatchesExtendedResponseRule } from '../rule/UserProvidedPublicationTimeMatchesExtendedResponseRule';
import { UserProvidedPublicationVerificationRule } from '../rule/UserProvidedPublicationVerificationRule';
import { VerificationPolicy } from './VerificationPolicy';
/**
 * Policy for verifying KSI signature with user provided publication.
 */
export class UserProvidedPublicationBasedVerificationPolicy extends VerificationPolicy {
    constructor() {
        const verificationRule = new UserProvidedPublicationCreationTimeVerificationRule() // Gen-02
            .onSuccess(new ExtendingPermittedVerificationRule() // Gen-02
            .onSuccess(new ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule() // Gen-02
            .onSuccess(new UserProvidedPublicationHashMatchesExtendedResponseRule() // Pub-01
            .onSuccess(new UserProvidedPublicationTimeMatchesExtendedResponseRule() // Pub-02
            .onSuccess(new UserProvidedPublicationExtendedSignatureInputHashRule())))));
        super(new UserProvidedPublicationExistenceRule() // Gen-02
            .onSuccess(new SignaturePublicationRecordExistenceRule() // Gen-02
            .onSuccess(new UserProvidedPublicationVerificationRule() // Pub-04, Gen-02
            .onSuccess(new CalendarHashChainAlgorithmDeprecatedRule()) // Gen-02
            .onNa(verificationRule))
            .onNa(verificationRule))); // Pub-03
    }
}
