import { KeyBasedVerificationPolicy } from './KeyBasedVerificationPolicy';
import { PublicationBasedVerificationPolicy } from './PublicationBasedVerificationPolicy';
import { VerificationPolicy } from './VerificationPolicy';
/**
 * Default verification policy
 */
export class DefaultVerificationPolicy extends VerificationPolicy {
    constructor() {
        super(new PublicationBasedVerificationPolicy()
            .onNa(new KeyBasedVerificationPolicy(true)));
    }
}
