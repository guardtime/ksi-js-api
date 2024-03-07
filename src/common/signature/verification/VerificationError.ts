/*
 * Copyright 2013-2022 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

/**
 * Verification error.
 */
export class VerificationError {
  public readonly code: string;
  public readonly message: string;

  /**
   * Verification error constructor.
   * @param code Error code.
   * @param message Error message.
   */
  private constructor(code: string, message: string) {
    this.code = code;
    this.message = message;

    Object.freeze(this);
  }

  /**
   * Wrong document error.
   */
  public static GEN_01(): VerificationError {
    return new VerificationError('GEN-01', 'Wrong document');
  }

  /**
   * Verification inconclusive error.
   */
  public static GEN_02(): VerificationError {
    return new VerificationError('GEN-02', 'Verification inconclusive');
  }

  /**
   * Input hash level too large error.
   */
  public static GEN_03(): VerificationError {
    return new VerificationError('GEN-03', 'Input hash level too large');
  }

  /**
   * Wrong input hash algorithm.
   */
  public static GEN_04(): VerificationError {
    return new VerificationError('GEN-04', 'Wrong input hash algorithm');
  }

  /**
   * Inconsistent aggregation hash chains error.
   */
  public static INT_01(): VerificationError {
    return new VerificationError('INT-01', 'Inconsistent aggregation hash chains');
  }

  /**
   *  Inconsistent aggregation hash chain aggregation times error.
   */
  public static INT_02(): VerificationError {
    return new VerificationError('INT-02', 'Inconsistent aggregation hash chain aggregation times');
  }

  /**
   * Calendar hash chain input hash mismatch error.
   */
  public static INT_03(): VerificationError {
    return new VerificationError('INT-03', 'Calendar hash chain input hash mismatch');
  }

  /**
   * Calendar hash chain aggregation time mismatch error.
   */
  public static INT_04(): VerificationError {
    return new VerificationError('INT-04', 'Calendar hash chain aggregation time mismatch');
  }

  /**
   * Calendar hash chain shape inconsistent with aggregation time error.
   */
  public static INT_05(): VerificationError {
    return new VerificationError('INT-05', 'Calendar hash chain shape inconsistent with aggregation time');
  }

  /**
   * Calendar hash chain time inconsistent with calendar authentication record time error.
   */
  public static INT_06(): VerificationError {
    return new VerificationError(
      'INT-06',
      'Calendar hash chain time inconsistent with calendar authentication record time',
    );
  }

  /**
   * Calendar hash chain time inconsistent with publication time error.
   */
  public static INT_07(): VerificationError {
    return new VerificationError('INT-07', 'Calendar hash chain time inconsistent with publication time');
  }

  /**
   * Calendar hash chain root hash is inconsistent with calendar authentication record input hash error.
   */
  public static INT_08(): VerificationError {
    return new VerificationError(
      'INT-08',
      'Calendar hash chain root hash is inconsistent with calendar authentication record input hash',
    );
  }

  /**
   * Calendar hash chain root hash is inconsistent with published hash value error.
   */
  public static INT_09(): VerificationError {
    return new VerificationError('INT-09', 'Calendar hash chain root hash is inconsistent with published hash value');
  }

  /**
   * Aggregation hash chain chain index mismatch error.
   */
  public static INT_10(): VerificationError {
    return new VerificationError('INT-10', 'Aggregation hash chain chain index mismatch');
  }

  /**
   * The metadata record in the aggregation hash chain may not be trusted error.
   */
  public static INT_11(): VerificationError {
    return new VerificationError('INT-11', 'The metadata record in the aggregation hash chain may not be trusted');
  }

  /**
   * Inconsistent chain indexes error.
   */
  public static INT_12(): VerificationError {
    return new VerificationError('INT-12', 'Inconsistent chain indexes');
  }

  /**
   * Document hash algorithm deprecated at the time of signing.
   */
  public static INT_13(): VerificationError {
    return new VerificationError('INT-13', 'Document hash algorithm deprecated at the time of signing');
  }

  /**
   *  RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing.
   */
  public static INT_14(): VerificationError {
    return new VerificationError(
      'INT-14',
      'RFC3161 compatibility record composed of hash algorithms that where deprecated at the time of signing',
    );
  }

  /**
   * Aggregation hash chain uses hash algorithm that was deprecated at the time of signing.
   */
  public static INT_15(): VerificationError {
    return new VerificationError(
      'INT-15',
      'Aggregation hash chain uses hash algorithm that was deprecated at the time of signing',
    );
  }

  /**
   * Calendar hash chain hash algorithm was obsolete at publication time.
   */
  public static INT_16(): VerificationError {
    return new VerificationError('INT-16', 'Calendar hash chain hash algorithm was obsolete at publication time');
  }

  /**
   * The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing.
   */
  public static INT_17(): VerificationError {
    return new VerificationError(
      'INT-17',
      'The RFC3161 compatibility record output hash algorithm was deprecated at the time of signing',
    );
  }

  /**
   * Extender response calendar root hash mismatch error.
   */
  public static PUB_01(): VerificationError {
    return new VerificationError('PUB-01', 'Extender response calendar root hash mismatch');
  }

  /**
   * Extender response inconsistent error.
   */
  public static PUB_02(): VerificationError {
    return new VerificationError('PUB-02', 'Extender response inconsistent');
  }

  /**
   * Extender response input hash mismatch error.
   */
  public static PUB_03(): VerificationError {
    return new VerificationError('PUB-03', 'Extender response input hash mismatch');
  }

  /**
   * Publication record hash and user provided publication hash mismatch error.
   */
  public static PUB_04(): VerificationError {
    return new VerificationError('PUB-04', 'Publication record hash and user provided publication hash mismatch');
  }

  /**
   * Publication record hash and publications file publication hash mismatch error.
   */
  public static PUB_05(): VerificationError {
    return new VerificationError('PUB-05', 'Publication record hash and publications file publication hash mismatch');
  }

  /**
   * PKI signature not verified with certificate error.
   */
  public static KEY_02(): VerificationError {
    return new VerificationError('KEY-02', 'PKI signature not verified with certificate');
  }

  /**
   * Signing certificate not valid at aggregation time error.
   */
  public static KEY_03(): VerificationError {
    return new VerificationError('KEY-03', 'Signing certificate not valid at aggregation time');
  }

  /**
   * Calendar root hash mismatch error between signature and calendar database chain.
   */
  public static CAL_01(): VerificationError {
    return new VerificationError('CAL-01', 'Calendar root hash mismatch between signature and calendar database chain');
  }

  /**
   * Aggregation hash chain root hash and calendar database hash chain input hash mismatch error.
   */
  public static CAL_02(): VerificationError {
    return new VerificationError(
      'CAL-02',
      'Aggregation hash chain root hash and calendar database hash chain input hash mismatch',
    );
  }

  /**
   * Aggregation time mismatch error.
   */
  public static CAL_03(): VerificationError {
    return new VerificationError('CAL-03', 'Aggregation time mismatch');
  }

  /**
   * Calendar hash chain right links are inconsistent error.
   */
  public static CAL_04(): VerificationError {
    return new VerificationError('CAL-04', 'Calendar hash chain right links are inconsistent');
  }

  /**
   * Returns a string that represents the current object.
   */
  public toString(): string {
    return `[${this.code}] ${this.message}`;
  }
}
