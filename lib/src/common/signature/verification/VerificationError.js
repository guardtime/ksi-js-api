/**
 * Verification error
 */
export class VerificationError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
        Object.freeze(this);
    }
    /**
     * Wrong document error
     */
    static GEN_01() {
        return new VerificationError('GEN-01', 'Wrong document');
    }
    /**
     * Verification inconclusive error.
     */
    static GEN_02(error) {
        return new VerificationError('GEN-02', `Verification inconclusive: ${error}`);
    }
    /**
     * Input hash level too large error.
     */
    static GEN_03() {
        return new VerificationError('GEN-03', 'Input hash level too large');
    }
    /**
     * Wrong input hash algorithm.
     */
    static GEN_04() {
        return new VerificationError('GEN-04', 'Wrong input hash algorithm');
    }
    /**
     * Inconsistent aggregation hash chains error.
     */
    static INT_01() {
        return new VerificationError('INT-01', 'Inconsistent aggregation hash chains');
    }
    /**
     *  Inconsistent aggregation hash chain aggregation times error.
     */
    static INT_02() {
        return new VerificationError('INT-02', 'Inconsistent aggregation hash chain aggregation times');
    }
    /**
     * Calendar hash chain input hash mismatch error.
     */
    static INT_03() {
        return new VerificationError('INT-03', 'Calendar hash chain input hash mismatch');
    }
    /**
     * Calendar hash chain aggregation time mismatch error.
     */
    static INT_04() {
        return new VerificationError('INT-04', 'Calendar hash chain aggregation time mismatch');
    }
    /**
     * Calendar hash chain shape inconsistent with aggregation time error.
     */
    static INT_05() {
        return new VerificationError('INT-05', 'Calendar hash chain shape inconsistent with aggregation time');
    }
    /**
     * Calendar hash chain time inconsistent with calendar authentication record time error.
     */
    static INT_06() {
        return new VerificationError('INT-06', 'Calendar hash chain time inconsistent with calendar authentication record time');
    }
    /**
     * Calendar hash chain time inconsistent with publication time error.
     */
    static INT_07() {
        return new VerificationError('INT-07', 'Calendar hash chain time inconsistent with publication time');
    }
    /**
     * Calendar hash chain root hash is inconsistent with calendar authentication record input hash error.
     */
    static INT_08() {
        return new VerificationError('INT-08', 'Calendar hash chain root hash is inconsistent with calendar authentication record input hash');
    }
    /**
     * Calendar hash chain root hash is inconsistent with published hash value error.
     */
    static INT_09() {
        return new VerificationError('INT-09', 'Calendar hash chain root hash is inconsistent with published hash value');
    }
    /**
     * Aggregation hash chain chain index mismatch error.
     */
    static INT_10() {
        return new VerificationError('INT-10', 'Aggregation hash chain chain index mismatch');
    }
    /**
     * The meta-data record in the aggregation hash chain may not be trusted error.
     */
    static INT_11() {
        return new VerificationError('INT-11', 'The meta-data record in the aggregation hash chain may not be trusted');
    }
    /**
     * Inconsistent chain indexes error.
     */
    static INT_12() {
        return new VerificationError('INT-12', 'Inconsistent chain indexes');
    }
    /**
     * Document hash algorithm deprecated at the time of signing.
     */
    static INT_13() {
        return new VerificationError('INT-13', 'Document hash algorithm deprecated at the time of signing');
    }
    /**
     *  RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing.
     */
    static INT_14() {
        return new VerificationError('INT-14', 'RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing');
    }
    /**
     * Aggregation hash chain uses hash algorithm that was deprecated at the time of signing.
     */
    static INT_15() {
        return new VerificationError('INT-15', 'Aggregation hash chain uses hash algorithm that was deprecated at the time of signing');
    }
    /**
     * Calendar hash chain hash algorithm was obsolete at publication time.
     */
    static INT_16() {
        return new VerificationError('INT-16', 'Calendar hash chain hash algorithm was obsolete at publication time');
    }
    /**
     * The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing.
     */
    static INT_17() {
        return new VerificationError('INT-17', 'The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing');
    }
    /**
     * Extender response calendar root hash mismatch error.
     */
    static PUB_01() {
        return new VerificationError('PUB-01', 'Extender response calendar root hash mismatch');
    }
    /**
     * Extender response inconsistent error.
     */
    static PUB_02() {
        return new VerificationError('PUB-02', 'Extender response inconsistent');
    }
    /**
     * Extender response input hash mismatch error.
     */
    static PUB_03() {
        return new VerificationError('PUB-03', 'Extender response input hash mismatch');
    }
    /**
     * Publication record hash and user provided publication hash mismatch error.
     */
    static PUB_04() {
        return new VerificationError('PUB-04', 'Publication record hash and user provided publication hash mismatch');
    }
    /**
     * Publication record hash and publications file publication hash mismatch error.
     */
    static PUB_05() {
        return new VerificationError('PUB-05', 'Publication record hash and publications file publication hash mismatch');
    }
    /**
     * Certificate not found error.
     */
    static KEY_01() {
        return new VerificationError('KEY-01', 'Certificate not found');
    }
    /**
     * PKI signature not verified with certificate error.
     */
    static KEY_02() {
        return new VerificationError('KEY-02', 'PKI signature not verified with certificate');
    }
    /**
     * Signing certificate not valid at aggregation time error.
     */
    static KEY_03() {
        return new VerificationError('KEY-03', 'Signing certificate not valid at aggregation time');
    }
    /**
     * Calendar root hash mismatch error between signature and calendar database chain.
     */
    static CAL_01() {
        return new VerificationError('CAL-01', 'Calendar root hash mismatch between signature and calendar database chain');
    }
    /**
     * Aggregation hash chain root hash and calendar database hash chain input hash mismatch error.
     */
    static CAL_02() {
        return new VerificationError('CAL-02', 'Aggregation hash chain root hash and calendar database hash chain input hash mismatch');
    }
    /**
     * Aggregation time mismatch error.
     */
    static CAL_03() {
        return new VerificationError('CAL-03', 'Aggregation time mismatch');
    }
    /**
     * Calendar hash chain right links are inconsistent error.
     */
    static CAL_04() {
        return new VerificationError('CAL-04', 'Calendar hash chain right links are inconsistent');
    }
    /**
     * Returns a string that represents the current object.
     */
    toString() {
        return `[${this.code}] ${this.message}`;
    }
}
