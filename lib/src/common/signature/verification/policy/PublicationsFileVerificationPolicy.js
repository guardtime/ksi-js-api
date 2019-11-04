import { CalendarHashChainAlgorithmDeprecatedRule } from '../rule/CalendarHashChainAlgorithmDeprecatedRule';
import { ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule } from '../rule/ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule';
import { ExtendingPermittedVerificationRule } from '../rule/ExtendingPermittedVerificationRule';
import { PublicationsFileExtendedSignatureInputHashRule } from '../rule/PublicationsFileExtendedSignatureInputHashRule';
// tslint:disable-next-line:max-line-length
import { PublicationsFilePublicationHashMatchesExtenderResponseRule } from '../rule/PublicationsFilePublicationHashMatchesExtenderResponseRule';
// tslint:disable-next-line:max-line-length
import { PublicationsFilePublicationTimeMatchesExtenderResponseRule } from '../rule/PublicationsFilePublicationTimeMatchesExtenderResponseRule';
import { PublicationsFileSignaturePublicationMatchRule } from '../rule/PublicationsFileSignaturePublicationMatchRule';
import { SignaturePublicationRecordExistenceRule } from '../rule/SignaturePublicationRecordExistenceRule';
import { VerificationPolicy } from './VerificationPolicy';
/**
 * Policy for verifying KSI signature with publications file.
 */
export class PublicationsFileVerificationPolicy extends VerificationPolicy {
    constructor() {
        const verificationRule = new ExtendingPermittedVerificationRule() // Gen-02
            .onSuccess(new ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule() // Gen-02
            .onSuccess(new PublicationsFilePublicationHashMatchesExtenderResponseRule() // Pub-01,  Gen-02
            .onSuccess(new PublicationsFilePublicationTimeMatchesExtenderResponseRule() // Pub-02
            .onSuccess(new PublicationsFileExtendedSignatureInputHashRule())))); // Pub-03
        super(new SignaturePublicationRecordExistenceRule() // Gen-02
            .onSuccess(new PublicationsFileSignaturePublicationMatchRule() // Pub-05, Gen-02
            .onSuccess(new CalendarHashChainAlgorithmDeprecatedRule()) // Gen-02
            .onNa(verificationRule))
            .onNa(verificationRule), "PublicationsFileVerificationPolicy");
    }
}
