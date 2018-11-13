/**
 * Verification error
 */
export class VerificationError {
    /**
     * Wrong document error
     */
    public static readonly GEN_01: VerificationError = new VerificationError('GEN-01', 'Wrong document');

    /**
     * Verification inconclusive error.
     */
    public static readonly GEN_02: VerificationError = new VerificationError('GEN-02', 'Verification inconclusive');

    /**
     * Input hash level too large error.
     */
    public static readonly GEN_03: VerificationError = new VerificationError('GEN-03', 'Input hash level too large');

    /**
     * Wrong input hash algorithm.
     */
    public static readonly GEN_04: VerificationError = new VerificationError('GEN-04', 'Wrong input hash algorithm');

    /**
     * Inconsistent aggregation hash chains error.
     */
    public static readonly INT_01: VerificationError = new VerificationError('INT-01', 'Inconsistent aggregation hash chains');

    /**
     *  Inconsistent aggregation hash chain aggregation times error.
     */
    public static readonly INT_02: VerificationError =
        new VerificationError('INT-02', 'Inconsistent aggregation hash chain aggregation times');

    /**
     * Calendar hash chain input hash mismatch error.
     */
    public static readonly INT_03: VerificationError = new VerificationError('INT-03', 'Calendar hash chain input hash mismatch');

    /**
     * Calendar hash chain aggregation time mismatch error.
     */
    public static readonly INT_04: VerificationError = new VerificationError('INT-04', 'Calendar hash chain aggregation time mismatch');

    /**
     * Calendar hash chain shape inconsistent with aggregation time error.
     */
    public static readonly INT_05: VerificationError =
        new VerificationError('INT-05', 'Calendar hash chain shape inconsistent with aggregation time');

    /**
     * Calendar hash chain time inconsistent with calendar authentication record time error.
     */
    public static readonly INT_06: VerificationError =
        new VerificationError('INT-06', 'Calendar hash chain time inconsistent with calendar authentication record time');

    /**
     * Calendar hash chain time inconsistent with publication time error.
     */
    public static readonly INT_07: VerificationError =
        new VerificationError('INT-07', 'Calendar hash chain time inconsistent with publication time');

    /**
     * Calendar hash chain root hash is inconsistent with calendar authentication record input hash error.
     */
    public static readonly INT_08: VerificationError =
        new VerificationError('INT-08', 'Calendar hash chain root hash is inconsistent with calendar authentication record input hash');

    /**
     * Calendar hash chain root hash is inconsistent with published hash value error.
     */
    public static readonly INT_09: VerificationError =
        new VerificationError('INT-09', 'Calendar hash chain root hash is inconsistent with published hash value');

    /**
     * Aggregation hash chain chain index mismatch error.
     */
    public static readonly INT_10: VerificationError = new VerificationError('INT-10', 'Aggregation hash chain chain index mismatch');

    /**
     * The meta-data record in the aggregation hash chain may not be trusted error.
     */
    public static readonly INT_11: VerificationError =
        new VerificationError('INT-11', 'The meta-data record in the aggregation hash chain may not be trusted');

    /**
     * Inconsistent chain indexes error.
     */
    public static readonly INT_12: VerificationError = new VerificationError('INT-12', 'Inconsistent chain indexes');

    /**
     * Document hash algorithm deprecated at the time of signing.
     */
    public static readonly INT_13: VerificationError =
        new VerificationError('INT-13', 'Document hash algorithm deprecated at the time of signing');

    /**
     *  RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing.
     */
    public static readonly INT_14: VerificationError =
        new VerificationError('INT-14',
                              'RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing');

    /**
     * Aggregation hash chain uses hash algorithm that was deprecated at the time of signing.
     */
    public static readonly INT_15: VerificationError =
        new VerificationError('INT-15', 'Aggregation hash chain uses hash algorithm that was deprecated at the time of signing');

    /**
     * Calendar hash chain hash algorithm was obsolete at publication time.
     */
    public static readonly INT_16: VerificationError =
        new VerificationError('INT-16', 'Calendar hash chain hash algorithm was obsolete at publication time');

    /**
     * The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing.
     */
    public static readonly INT_17: VerificationError =
        new VerificationError('INT-17',
                              'The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing');

    /**
     * Extender response calendar root hash mismatch error.
     */
    public static readonly PUB_01: VerificationError = new VerificationError('PUB-01', 'Extender response calendar root hash mismatch');

    /**
     * Extender response inconsistent error.
     */
    public static readonly PUB_02: VerificationError = new VerificationError('PUB-02', 'Extender response inconsistent');

    /**
     * Extender response input hash mismatch error.
     */
    public static readonly PUB_03: VerificationError = new VerificationError('PUB-03', 'Extender response input hash mismatch');

    /**
     * Publication record hash and user provided publication hash mismatch error.
     */
    public static readonly PUB_04: VerificationError =
        new VerificationError('PUB-04', 'Publication record hash and user provided publication hash mismatch');

    /**
     * Publication record hash and publications file publication hash mismatch error.
     */
    public static readonly PUB_05: VerificationError =
        new VerificationError('PUB-05', 'Publication record hash and publications file publication hash mismatch');

    /**
     * Certificate not found error.
     */
    public static readonly KEY_01: VerificationError = new VerificationError('KEY-01', 'Certificate not found');

    /**
     * PKI signature not verified with certificate error.
     */
    public static readonly KEY_02: VerificationError = new VerificationError('KEY-02', 'PKI signature not verified with certificate');

    /**
     * Signing certificate not valid at aggregation time error.
     */
    public static readonly KEY_03: VerificationError = new VerificationError('KEY-03', 'Signing certificate not valid at aggregation time');

    /**
     * Calendar root hash mismatch error between signature and calendar database chain.
     */
    public static readonly CAL_01: VerificationError =
        new VerificationError('CAL-01', 'Calendar root hash mismatch between signature and calendar database chain');

    /**
     * Aggregation hash chain root hash and calendar database hash chain input hash mismatch error.
     */
    public static readonly CAL_02: VerificationError =
        new VerificationError('CAL-02', 'Aggregation hash chain root hash and calendar database hash chain input hash mismatch');

    /**
     * Aggregation time mismatch error.
     */
    public static readonly CAL_03: VerificationError = new VerificationError('CAL-03', 'Aggregation time mismatch');

    /**
     * Calendar hash chain right links are inconsistent error.
     */
    public static readonly CAL_04: VerificationError = new VerificationError('CAL-04', 'Calendar hash chain right links are inconsistent');

    public readonly code: string;
    public readonly message: string;

    private constructor(code: string, message: string) {
        this.code = code;
        this.message = message;

        Object.freeze(this);
    }

    /**
     * Returns a string that represents the current object.
     */
    public toString(): string {
        return `${this.code}: ${this.message}`;
    }

}
