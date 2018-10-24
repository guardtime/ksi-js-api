/**
 * Verification error
 */
export class VerificationError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
    /**
     * Returns a string that represents the current object.
     */
    toString() {
        return `${this.code}: ${this.message}`;
    }
}
/**
 * Wrong document error
 */
VerificationError.GEN_01 = new VerificationError('GEN-01', 'Wrong document');
/**
 * Verification inconclusive error.
 */
VerificationError.GEN_02 = new VerificationError('GEN-02', 'Verification inconclusive');
/**
 * Input hash level too large error.
 */
VerificationError.GEN_03 = new VerificationError('GEN-03', 'Input hash level too large');
/**
 * Wrong input hash algorithm.
 */
VerificationError.GEN_04 = new VerificationError('GEN-04', 'Wrong input hash algorithm');
/**
 * Inconsistent aggregation hash chains error.
 */
VerificationError.INT_01 = new VerificationError('INT-01', 'Inconsistent aggregation hash chains');
/**
 *  Inconsistent aggregation hash chain aggregation times error.
 */
VerificationError.INT_02 = new VerificationError('INT-02', 'Inconsistent aggregation hash chain aggregation times');
/**
 * Calendar hash chain input hash mismatch error.
 */
VerificationError.INT_03 = new VerificationError('INT-03', 'Calendar hash chain input hash mismatch');
/**
 * Calendar hash chain aggregation time mismatch error.
 */
VerificationError.INT_04 = new VerificationError('INT-04', 'Calendar hash chain aggregation time mismatch');
/**
 * Calendar hash chain shape inconsistent with aggregation time error.
 */
VerificationError.INT_05 = new VerificationError('INT-05', 'Calendar hash chain shape inconsistent with aggregation time');
/**
 * Calendar hash chain time inconsistent with calendar authentication record time error.
 */
VerificationError.INT_06 = new VerificationError('INT-06', 'Calendar hash chain time inconsistent with calendar authentication record time');
/**
 * Calendar hash chain time inconsistent with publication time error.
 */
VerificationError.INT_07 = new VerificationError('INT-07', 'Calendar hash chain time inconsistent with publication time');
/**
 * Calendar hash chain root hash is inconsistent with calendar authentication record input hash error.
 */
VerificationError.INT_08 = new VerificationError('INT-08', 'Calendar hash chain root hash is inconsistent with calendar authentication record input hash');
/**
 * Calendar hash chain root hash is inconsistent with published hash value error.
 */
VerificationError.INT_09 = new VerificationError('INT-09', 'Calendar hash chain root hash is inconsistent with published hash value');
/**
 * Aggregation hash chain chain index mismatch error.
 */
VerificationError.INT_10 = new VerificationError('INT-10', 'Aggregation hash chain chain index mismatch');
/**
 * The meta-data record in the aggregation hash chain may not be trusted error.
 */
VerificationError.INT_11 = new VerificationError('INT-11', 'The meta-data record in the aggregation hash chain may not be trusted');
/**
 * Inconsistent chain indexes error.
 */
VerificationError.INT_12 = new VerificationError('INT-12', 'Inconsistent chain indexes');
/**
 * Document hash algorithm deprecated at the time of signing.
 */
VerificationError.INT_13 = new VerificationError('INT-13', 'Document hash algorithm deprecated at the time of signing');
/**
 *  RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing.
 */
VerificationError.INT_14 = new VerificationError('INT-14', 'RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing');
/**
 * Aggregation hash chain uses hash algorithm that was deprecated at the time of signing.
 */
VerificationError.INT_15 = new VerificationError('INT-15', 'Aggregation hash chain uses hash algorithm that was deprecated at the time of signing');
/**
 * Calendar hash chain hash algorithm was obsolete at publication time.
 */
VerificationError.INT_16 = new VerificationError('INT-16', 'Calendar hash chain hash algorithm was obsolete at publication time');
/**
 * The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing.
 */
VerificationError.INT_17 = new VerificationError('INT-17', 'The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing');
/**
 * Extender response calendar root hash mismatch error.
 */
VerificationError.PUB_01 = new VerificationError('PUB-01', 'Extender response calendar root hash mismatch');
/**
 * Extender response inconsistent error.
 */
VerificationError.PUB_02 = new VerificationError('PUB-02', 'Extender response inconsistent');
/**
 * Extender response input hash mismatch error.
 */
VerificationError.PUB_03 = new VerificationError('PUB-03', 'Extender response input hash mismatch');
/**
 * Publication record hash and user provided publication hash mismatch error.
 */
VerificationError.PUB_04 = new VerificationError('PUB-04', 'Publication record hash and user provided publication hash mismatch');
/**
 * Publication record hash and publications file publication hash mismatch error.
 */
VerificationError.PUB_05 = new VerificationError('PUB-05', 'Publication record hash and publications file publication hash mismatch');
/**
 * Certificate not found error.
 */
VerificationError.KEY_01 = new VerificationError('KEY-01', 'Certificate not found');
/**
 * PKI signature not verified with certificate error.
 */
VerificationError.KEY_02 = new VerificationError('KEY-02', 'PKI signature not verified with certificate');
/**
 * Signing certificate not valid at aggregation time error.
 */
VerificationError.KEY_03 = new VerificationError('KEY-03', 'Signing certificate not valid at aggregation time');
/**
 * Calendar root hash mismatch error between signature and calendar database chain.
 */
VerificationError.CAL_01 = new VerificationError('CAL-01', 'Calendar root hash mismatch between signature and calendar database chain');
/**
 * Aggregation hash chain root hash and calendar database hash chain input hash mismatch error.
 */
VerificationError.CAL_02 = new VerificationError('CAL-02', 'Aggregation hash chain root hash and calendar database hash chain input hash mismatch');
/**
 * Aggregation time mismatch error.
 */
VerificationError.CAL_03 = new VerificationError('CAL-03', 'Aggregation time mismatch');
/**
 * Calendar hash chain right links are inconsistent error.
 */
VerificationError.CAL_04 = new VerificationError('CAL-04', 'Calendar hash chain right links are inconsistent');
