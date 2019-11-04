import { UserProvidedPublicationExistenceRule } from '../rule/UserProvidedPublicationExistenceRule';
import { InternalVerificationPolicy } from './InternalVerificationPolicy';
import { PublicationsFileVerificationPolicy } from './PublicationsFileVerificationPolicy';
import { UserProvidedPublicationBasedVerificationPolicy } from './UserProvidedPublicationBasedVerificationPolicy';
import { VerificationPolicy } from './VerificationPolicy';
/**
 * Policy for verifying KSI signature with publication.
 */
export class PublicationBasedVerificationPolicy extends VerificationPolicy {
    constructor() {
        super(new InternalVerificationPolicy()
            .onSuccess(new UserProvidedPublicationExistenceRule() // Gen-02
            .onSuccess(new UserProvidedPublicationBasedVerificationPolicy()) // Gen-02
            .onNa(new PublicationsFileVerificationPolicy())), "PublicationBasedVerificationPolicy");
    }
}
