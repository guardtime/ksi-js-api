/**
 * Verification error
 */
export declare class VerificationError {
    readonly code: string;
    readonly message: string;
    private constructor();
    /**
     * Wrong document error
     */
    static GEN_01(): VerificationError;
    /**
     * Verification inconclusive error.
     */
    static GEN_02(error: Error): VerificationError;
    /**
     * Input hash level too large error.
     */
    static GEN_03(): VerificationError;
    /**
     * Wrong input hash algorithm.
     */
    static GEN_04(): VerificationError;
    /**
     * Inconsistent aggregation hash chains error.
     */
    static INT_01(): VerificationError;
    /**
     *  Inconsistent aggregation hash chain aggregation times error.
     */
    static INT_02(): VerificationError;
    /**
     * Calendar hash chain input hash mismatch error.
     */
    static INT_03(): VerificationError;
    /**
     * Calendar hash chain aggregation time mismatch error.
     */
    static INT_04(): VerificationError;
    /**
     * Calendar hash chain shape inconsistent with aggregation time error.
     */
    static INT_05(): VerificationError;
    /**
     * Calendar hash chain time inconsistent with calendar authentication record time error.
     */
    static INT_06(): VerificationError;
    /**
     * Calendar hash chain time inconsistent with publication time error.
     */
    static INT_07(): VerificationError;
    /**
     * Calendar hash chain root hash is inconsistent with calendar authentication record input hash error.
     */
    static INT_08(): VerificationError;
    /**
     * Calendar hash chain root hash is inconsistent with published hash value error.
     */
    static INT_09(): VerificationError;
    /**
     * Aggregation hash chain chain index mismatch error.
     */
    static INT_10(): VerificationError;
    /**
     * The meta-data record in the aggregation hash chain may not be trusted error.
     */
    static INT_11(): VerificationError;
    /**
     * Inconsistent chain indexes error.
     */
    static INT_12(): VerificationError;
    /**
     * Document hash algorithm deprecated at the time of signing.
     */
    static INT_13(): VerificationError;
    /**
     *  RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing.
     */
    static INT_14(): VerificationError;
    /**
     * Aggregation hash chain uses hash algorithm that was deprecated at the time of signing.
     */
    static INT_15(): VerificationError;
    /**
     * Calendar hash chain hash algorithm was obsolete at publication time.
     */
    static INT_16(): VerificationError;
    /**
     * The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing.
     */
    static INT_17(): VerificationError;
    /**
     * Extender response calendar root hash mismatch error.
     */
    static PUB_01(): VerificationError;
    /**
     * Extender response inconsistent error.
     */
    static PUB_02(): VerificationError;
    /**
     * Extender response input hash mismatch error.
     */
    static PUB_03(): VerificationError;
    /**
     * Publication record hash and user provided publication hash mismatch error.
     */
    static PUB_04(): VerificationError;
    /**
     * Publication record hash and publications file publication hash mismatch error.
     */
    static PUB_05(): VerificationError;
    /**
     * Certificate not found error.
     */
    static KEY_01(): VerificationError;
    /**
     * PKI signature not verified with certificate error.
     */
    static KEY_02(): VerificationError;
    /**
     * Signing certificate not valid at aggregation time error.
     */
    static KEY_03(): VerificationError;
    /**
     * Calendar root hash mismatch error between signature and calendar database chain.
     */
    static CAL_01(): VerificationError;
    /**
     * Aggregation hash chain root hash and calendar database hash chain input hash mismatch error.
     */
    static CAL_02(): VerificationError;
    /**
     * Aggregation time mismatch error.
     */
    static CAL_03(): VerificationError;
    /**
     * Calendar hash chain right links are inconsistent error.
     */
    static CAL_04(): VerificationError;
    /**
     * Returns a string that represents the current object.
     */
    toString(): string;
}
