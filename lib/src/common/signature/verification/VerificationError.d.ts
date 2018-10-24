/**
 * Verification error
 */
export declare class VerificationError {
    /**
     * Wrong document error
     */
    static readonly GEN_01: VerificationError;
    /**
     * Verification inconclusive error.
     */
    static readonly GEN_02: VerificationError;
    /**
     * Input hash level too large error.
     */
    static readonly GEN_03: VerificationError;
    /**
     * Wrong input hash algorithm.
     */
    static readonly GEN_04: VerificationError;
    /**
     * Inconsistent aggregation hash chains error.
     */
    static readonly INT_01: VerificationError;
    /**
     *  Inconsistent aggregation hash chain aggregation times error.
     */
    static readonly INT_02: VerificationError;
    /**
     * Calendar hash chain input hash mismatch error.
     */
    static readonly INT_03: VerificationError;
    /**
     * Calendar hash chain aggregation time mismatch error.
     */
    static readonly INT_04: VerificationError;
    /**
     * Calendar hash chain shape inconsistent with aggregation time error.
     */
    static readonly INT_05: VerificationError;
    /**
     * Calendar hash chain time inconsistent with calendar authentication record time error.
     */
    static readonly INT_06: VerificationError;
    /**
     * Calendar hash chain time inconsistent with publication time error.
     */
    static readonly INT_07: VerificationError;
    /**
     * Calendar hash chain root hash is inconsistent with calendar authentication record input hash error.
     */
    static readonly INT_08: VerificationError;
    /**
     * Calendar hash chain root hash is inconsistent with published hash value error.
     */
    static readonly INT_09: VerificationError;
    /**
     * Aggregation hash chain chain index mismatch error.
     */
    static readonly INT_10: VerificationError;
    /**
     * The meta-data record in the aggregation hash chain may not be trusted error.
     */
    static readonly INT_11: VerificationError;
    /**
     * Inconsistent chain indexes error.
     */
    static readonly INT_12: VerificationError;
    /**
     * Document hash algorithm deprecated at the time of signing.
     */
    static readonly INT_13: VerificationError;
    /**
     *  RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing.
     */
    static readonly INT_14: VerificationError;
    /**
     * Aggregation hash chain uses hash algorithm that was deprecated at the time of signing.
     */
    static readonly INT_15: VerificationError;
    /**
     * Calendar hash chain hash algorithm was obsolete at publication time.
     */
    static readonly INT_16: VerificationError;
    /**
     * The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing.
     */
    static readonly INT_17: VerificationError;
    /**
     * Extender response calendar root hash mismatch error.
     */
    static readonly PUB_01: VerificationError;
    /**
     * Extender response inconsistent error.
     */
    static readonly PUB_02: VerificationError;
    /**
     * Extender response input hash mismatch error.
     */
    static readonly PUB_03: VerificationError;
    /**
     * Publication record hash and user provided publication hash mismatch error.
     */
    static readonly PUB_04: VerificationError;
    /**
     * Publication record hash and publications file publication hash mismatch error.
     */
    static readonly PUB_05: VerificationError;
    /**
     * Certificate not found error.
     */
    static readonly KEY_01: VerificationError;
    /**
     * PKI signature not verified with certificate error.
     */
    static readonly KEY_02: VerificationError;
    /**
     * Signing certificate not valid at aggregation time error.
     */
    static readonly KEY_03: VerificationError;
    /**
     * Calendar root hash mismatch error between signature and calendar database chain.
     */
    static readonly CAL_01: VerificationError;
    /**
     * Aggregation hash chain root hash and calendar database hash chain input hash mismatch error.
     */
    static readonly CAL_02: VerificationError;
    /**
     * Aggregation time mismatch error.
     */
    static readonly CAL_03: VerificationError;
    /**
     * Calendar hash chain right links are inconsistent error.
     */
    static readonly CAL_04: VerificationError;
    readonly code: string;
    readonly message: string;
    private constructor();
    /**
     * Returns a string that represents the current object.
     */
    toString(): string;
}
