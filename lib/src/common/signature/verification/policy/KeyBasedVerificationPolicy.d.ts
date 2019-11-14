import { VerificationPolicy } from './VerificationPolicy';
/**
 * Policy for verifying KSI signature with PKI.
 */
export declare class KeyBasedVerificationPolicy extends VerificationPolicy {
    constructor(skipInternalVerification?: boolean);
}
